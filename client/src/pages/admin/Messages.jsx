import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare, Mail, Phone, Clock, Check, Trash2, Reply,
  Search, Tag, Send, CheckCheck, RotateCcw, Eye, EyeOff,
  ShoppingBag, User, ArrowLeft, Inbox
} from 'lucide-react';
import {
  getContactMessages,
  updateMessageStatus,
  replyToMessage,
  deleteMessage
} from '../../services/adminService';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

// ─── Status helpers ─────────────────────────────────────────────────────────
const STATUS_BADGE = {
  NEW:      'bg-blue-100 text-blue-700',
  READ:     'bg-gray-100 text-gray-600',
  REPLIED:  'bg-green-100 text-green-700',
  RESOLVED: 'bg-purple-100 text-purple-700',
};

const CATEGORY_BADGE = {
  'Order Support':   'bg-orange-50 text-orange-600',
  'Payment Issue':   'bg-red-50 text-red-600',
  'Product Inquiry': 'bg-blue-50 text-blue-600',
  'Complaint':       'bg-red-50 text-red-700',
  'General Inquiry': 'bg-gray-50 text-gray-600',
  'Other':           'bg-gray-50 text-gray-500',
};

// ─── Filter tabs ─────────────────────────────────────────────────────────────
const TABS = [
  { key: 'all',         label: 'All' },
  { key: 'unread',      label: 'Unread' },
  { key: 'needs-reply', label: 'Needs Reply' },
  { key: 'resolved',    label: 'Resolved' },
];

const applyTab = (msgs, tab) => {
  switch (tab) {
    case 'unread':      return msgs.filter(m => m.status === 'NEW');
    case 'needs-reply': return msgs.filter(m => m.status !== 'REPLIED' && m.status !== 'RESOLVED');
    case 'resolved':    return msgs.filter(m => m.status === 'RESOLVED');
    default:            return msgs;
  }
};

// ─── Utility ─────────────────────────────────────────────────────────────────
const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminMessages = () => {
  const [messages, setMessages]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [activeTab, setActiveTab]         = useState('all');
  const [search, setSearch]               = useState('');
  const [viewingMessage, setViewingMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [replyText, setReplyText]         = useState('');
  const [sendingReply, setSendingReply]   = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const replyRef = useRef(null);

  const fetchMessages = () => {
    setLoading(true);
    getContactMessages()
      .then(res => setMessages(res.data.data))
      .catch(() => setError('Failed to load messages.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Messages | Admin';
    fetchMessages();
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalCount    = messages.length;
  const unreadCount   = messages.filter(m => m.status === 'NEW').length;
  const needsReply    = messages.filter(m => m.status !== 'REPLIED' && m.status !== 'RESOLVED').length;
  const resolvedCount = messages.filter(m => m.status === 'RESOLVED').length;

  // ── Filtered list ──────────────────────────────────────────────────────────
  const tabFiltered = applyTab(messages, activeTab);
  const filtered = tabFiltered.filter(m => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(s) ||
      m.email?.toLowerCase().includes(s) ||
      m.mobile?.includes(s) ||
      m.message?.toLowerCase().includes(s) ||
      m.subject?.toLowerCase().includes(s) ||
      m.orderId?.toLowerCase().includes(s)
    );
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleView = async (msg) => {
    setViewingMessage(msg);
    setReplyText('');
    setShowMobileDetail(true);
    if (msg.status === 'NEW') {
      try {
        await updateMessageStatus(msg._id, 'READ');
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, status: 'READ' } : m));
        setViewingMessage(v => v?._id === msg._id ? { ...v, status: 'READ' } : v);
      } catch (_) {}
    }
  };

  const handleMarkStatus = async (id, status) => {
    try {
      await updateMessageStatus(id, status);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status } : m));
      setViewingMessage(v => v?._id === id ? { ...v, status } : v);
    } catch (_) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      setMessages(prev => prev.filter(m => m._id !== id));
      setConfirmDelete(null);
      if (viewingMessage?._id === id) {
        setViewingMessage(null);
        setShowMobileDetail(false);
      }
    } catch (_) {
      alert('Failed to delete message');
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !viewingMessage) return;
    setSendingReply(true);
    try {
      const res = await replyToMessage(viewingMessage._id, replyText.trim());
      const updated = res.data.data;
      setMessages(prev => prev.map(m => m._id === updated._id ? updated : m));
      setViewingMessage(updated);
      setReplyText('');
    } catch (_) {
      alert('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const overviewCards = [
    { label: 'Total Messages', value: totalCount,    color: 'bg-emerald-500', tab: 'all' },
    { label: 'Unread',         value: unreadCount,   color: 'bg-emerald-500',   tab: 'unread' },
    { label: 'Needs Reply',    value: needsReply,    color: 'bg-emerald-500',  tab: 'needs-reply' },
    { label: 'Resolved',       value: resolvedCount, color: 'bg-emerald-500',  tab: 'resolved' },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <MessageSquare size={26} className="text-gray-900" />
          Messages Inbox
        </h1>
        <p className="text-gray-500 mt-1">Manage customer inquiries from the Contact form</p>
      </div>

      {/* Overview Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {overviewCards.map(card => (
            <button
              key={card.tab}
              id={`messages-card-${card.tab}`}
              onClick={() => setActiveTab(card.tab)}
              className={`card p-5 text-left transition-all hover:shadow-md ${activeTab === card.tab ? 'ring-2 ring-offset-1 ring-indigo-400' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color} mb-3`}>
                <Inbox size={16} className="text-white" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{card.value}</p>
              <p className="text-sm font-semibold text-gray-500 mt-1">{card.label}</p>
            </button>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab.key}
            id={`messages-tab-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-500 bg-emerald-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
            {!loading && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {applyTab(messages, tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card p-4 mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, message, subject or order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 w-full"
          />
        </div>
      </div>

      {/* Split-pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Inbox list ────────────────────────────────────────────── */}
        <div className={`lg:col-span-1 ${showMobileDetail ? 'hidden lg:block' : 'block'}`}>
          {loading ? <Loading /> : error ? (
            <div className="text-red-500 text-sm p-4">{error}</div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No Messages Found"
              description={search || activeTab !== 'all' ? 'No messages match your filters.' : 'No contact messages yet.'}
            />
          ) : (
            <div className="flex flex-col gap-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
              {filtered.map(msg => (
                <div
                  key={msg._id}
                  onClick={() => handleView(msg)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    viewingMessage?._id === msg._id
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                      : msg.status === 'NEW'
                        ? 'bg-white border-blue-100 shadow-sm hover:border-indigo-200'
                        : 'bg-gray-50 border-gray-100 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {msg.status === 'NEW' && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                      <h3 className={`font-bold truncate text-sm ${msg.status === 'NEW' ? 'text-gray-900' : 'text-gray-700'}`}>
                        {msg.name}
                      </h3>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2">{fmtTime(msg.createdAt)}</span>
                  </div>

                  {(msg.subject || msg.category) && (
                    <p className="text-xs font-semibold text-indigo-600 mb-1 truncate">
                      {msg.subject || msg.category}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 truncate mb-2">{msg.message}</p>

                  <div className="flex items-center justify-between gap-2">
                    {msg.orderId && (
                      <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                        Order #{msg.orderId}
                      </span>
                    )}
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_BADGE[msg.status] || 'bg-gray-100 text-gray-500'}`}>
                      {msg.status === 'NEW' ? 'Unread' : msg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Message detail ────────────────────────────────────────── */}
        <div className={`lg:col-span-2 ${showMobileDetail ? 'block' : 'hidden lg:block'}`}>
          {viewingMessage ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">

              {/* Detail header */}
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                {/* Mobile back button */}
                <button
                  onClick={() => setShowMobileDetail(false)}
                  className="flex lg:hidden items-center gap-1.5 text-sm text-gray-500 font-semibold mb-3 hover:text-gray-700"
                >
                  <ArrowLeft size={16} /> Back to inbox
                </button>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                        {viewingMessage.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold text-gray-900">{viewingMessage.name}</h2>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-0.5">
                          {viewingMessage.mobile && (
                            <span className="flex items-center gap-1"><Phone size={12} />{viewingMessage.mobile}</span>
                          )}
                          {viewingMessage.email && (
                            <span className="flex items-center gap-1"><Mail size={12} />{viewingMessage.email}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {viewingMessage.category && (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_BADGE[viewingMessage.category] || 'bg-gray-100 text-gray-600'}`}>
                          <Tag size={10} className="inline mr-1" />{viewingMessage.category}
                        </span>
                      )}
                      {viewingMessage.orderId && (
                        <Link
                          to={`/admin/orders`}
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 flex items-center gap-1 hover:bg-amber-100 transition-colors"
                        >
                          <ShoppingBag size={10} /> Order #{viewingMessage.orderId}
                        </Link>
                      )}
                      {viewingMessage.email && (
                        <Link
                          to={`/admin/customers`}
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 flex items-center gap-1 hover:bg-green-100 transition-colors"
                        >
                          <User size={10} /> View Customer
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase ${STATUS_BADGE[viewingMessage.status] || 'bg-gray-100 text-gray-600'}`}>
                      {viewingMessage.status === 'NEW' ? 'Unread' : viewingMessage.status}
                    </span>
                    <span className="text-xs text-gray-400">{fmt(viewingMessage.createdAt)} · {fmtTime(viewingMessage.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Conversation body */}
              <div className="p-5 flex flex-col gap-4">
                {/* Subject */}
                {viewingMessage.subject && (
                  <p className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-2">
                    Re: {viewingMessage.subject}
                  </p>
                )}

                {/* Customer message bubble */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                    {viewingMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 mb-1">{viewingMessage.name} · {fmt(viewingMessage.createdAt)}</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {viewingMessage.message}
                    </div>
                  </div>
                </div>

                {/* Admin reply bubble (if exists) */}
                {viewingMessage.adminReply && (
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center shrink-0">
                      A
                    </div>
                    <div className="flex-1 flex flex-col items-end">
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        Admin · {viewingMessage.adminRepliedAt ? fmt(viewingMessage.adminRepliedAt) : ''}
                      </p>
                      <div className="bg-green-50 border border-green-100 rounded-2xl rounded-tr-sm p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap max-w-[90%]">
                        {viewingMessage.adminReply}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reply box */}
              <div className="p-5 border-t border-gray-100 bg-gray-50/30 rounded-b-2xl">
                <div className="flex gap-3 mb-3">
                  <textarea
                    ref={replyRef}
                    rows={3}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="input-field flex-1 resize-none text-sm"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && e.ctrlKey) handleSendReply();
                    }}
                  />
                </div>

                {/* Action buttons row */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Mark as Read / Unread toggle */}
                    {viewingMessage.status === 'NEW' ? (
                      <button
                        onClick={() => handleMarkStatus(viewingMessage._id, 'READ')}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
                        title="Mark as Read"
                      >
                        <Eye size={14} /> Mark Read
                      </button>
                    ) : viewingMessage.status === 'READ' ? (
                      <button
                        onClick={() => handleMarkStatus(viewingMessage._id, 'NEW')}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
                        title="Mark as Unread"
                      >
                        <EyeOff size={14} /> Mark Unread
                      </button>
                    ) : null}

                    {/* Mark Resolved / Reopen */}
                    {viewingMessage.status !== 'RESOLVED' ? (
                      <button
                        onClick={() => handleMarkStatus(viewingMessage._id, 'RESOLVED')}
                        className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <CheckCheck size={14} /> Resolve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkStatus(viewingMessage._id, 'READ')}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <RotateCcw size={14} /> Reopen
                      </button>
                    )}

                    {/* Reply via email fallback */}
                    {viewingMessage.email && (
                      <a
                        href={`mailto:${viewingMessage.email}?subject=Re: ${viewingMessage.subject || 'Your inquiry to Maruti Krushiseva Kendra'}`}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Mail size={14} /> Email
                      </a>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => setConfirmDelete(viewingMessage)}
                      className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>

                  {/* Send reply */}
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || sendingReply}
                    className="flex items-center gap-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 rounded-xl transition-colors shadow-sm shadow-green-600/20"
                  >
                    <Send size={15} />
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 lg:h-[calc(100vh-380px)] flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <MessageSquare size={52} className="mb-3 text-gray-200" />
              <p className="font-semibold text-gray-500">Select a message to read</p>
              <p className="text-sm mt-1">Click any conversation from the list</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="font-bold text-gray-900 text-lg mb-2">Delete Message?</h2>
            <p className="text-gray-600 text-sm mb-5">
              Are you sure you want to delete this message from <strong>{confirmDelete.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                className="btn-danger flex-1 justify-center"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
