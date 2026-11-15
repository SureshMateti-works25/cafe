import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CMSProject } from '../../types';
import { 
  Plus, 
  Sparkles, 
  Edit, 
  Trash2, 
  Image, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  X,
  FileCode2,
  Globe2
} from 'lucide-react';

export const CMSManager: React.FC = () => {
  const { cmsProjects, addCMSProject, updateCMSProject, deleteCMSProject, locations } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CMSProject['category']>('Promotion');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80');
  const [targetLocations, setTargetLocations] = useState<string[]>(['all']);
  const [startDate, setStartDate] = useState('2026-11-20');
  const [endDate, setEndDate] = useState('2026-11-30');
  const [status, setStatus] = useState<CMSProject['status']>('published');
  const [tagsInput, setTagsInput] = useState('Campaign, Special');

  const presetImages = [
    { label: 'Roasting & Beans', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Pastry & Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Jain & Vegan Food', url: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Latte Art Workshop', url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80' },
  ];

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Promotion');
    setSummary('');
    setContent('');
    setBannerImage(presetImages[0].url);
    setTargetLocations(['all']);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setStatus('published');
    setTagsInput('Promotion, Special');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: CMSProject) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setCategory(proj.category);
    setSummary(proj.summary);
    setContent(proj.content);
    setBannerImage(proj.bannerImage);
    setTargetLocations(proj.targetLocations);
    setStartDate(proj.startDate);
    setEndDate(proj.endDate || '');
    setStatus(proj.status);
    setTagsInput(proj.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary || !content) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    if (editingId) {
      updateCMSProject(editingId, {
        title,
        category,
        summary,
        content,
        bannerImage,
        targetLocations,
        startDate,
        endDate: endDate || undefined,
        status,
        tags,
      });
    } else {
      addCMSProject({
        title,
        category,
        summary,
        content,
        bannerImage,
        targetLocations,
        startDate,
        endDate: endDate || undefined,
        status,
        author: 'Cafe Marketing Team',
        tags,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cafe-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Globe2 className="w-4 h-4 text-amber-600" />
            <span>NO-CODE CONTENT MANAGEMENT SYSTEM (CMS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-cafe-900 mt-1">
            Marketing Projects & Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-cafe-500 mt-1">
            Empowers marketing and store managers to publish seasonal promotions, roastery workshops, and menu announcements without needing a developer.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Project / Promo
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cmsProjects.map(proj => (
          <div
            key={proj.id}
            className="bg-white rounded-3xl overflow-hidden border border-cafe-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-cafe-100">
                <img
                  src={proj.bannerImage}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-cafe-950/80 text-amber-300 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold">
                  {proj.category}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                    proj.status === 'published' ? 'bg-emerald-600 text-white' : 'bg-cafe-300 text-cafe-900'
                  }`}>
                    {proj.status}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif font-bold text-lg text-cafe-900 leading-snug group-hover:text-amber-800 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-cafe-600 leading-relaxed line-clamp-3">
                  {proj.summary}
                </p>

                <div className="pt-2 flex flex-wrap gap-1">
                  {proj.tags.map((tg, i) => (
                    <span key={i} className="text-[10px] bg-cafe-100 text-cafe-700 px-2 py-0.5 rounded-md">
                      #{tg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-cafe-100/80 mt-2 flex items-center justify-between text-xs text-cafe-500">
              <span className="font-mono text-[11px]">{proj.startDate}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(proj)}
                  className="p-1.5 rounded-lg text-cafe-600 hover:text-cafe-900 hover:bg-cafe-100 transition"
                  title="Edit Project"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCMSProject(proj.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NO-CODE CMS MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-cafe-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-cafe-200 flex items-center justify-between bg-cafe-50">
              <div className="flex items-center gap-2 text-cafe-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{editingId ? 'Edit CMS Project' : 'Add New Project / Campaign'}</span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-cafe-400 hover:text-cafe-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monsoon Cold Brew Festival & Cupping"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs sm:text-sm font-semibold focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="Promotion">Promotion / Discount</option>
                    <option value="Seasonal Roasts">Seasonal Roasts</option>
                    <option value="Cafe Workshop">Cafe Workshop</option>
                    <option value="Community Event">Community Event</option>
                    <option value="Menu Launch">Menu Launch</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Publishing Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="published">Published (Live on Website)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Banner Image selector with quick presets */}
              <div>
                <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Banner Image (Select preset or enter custom URL)
                </label>
                <div className="flex gap-2 mb-2">
                  {presetImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setBannerImage(img.url)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold ${
                        bannerImage === img.url ? 'bg-amber-600 text-white' : 'bg-cafe-50 border-cafe-200 text-cafe-700'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  required
                  value={bannerImage}
                  onChange={e => setBannerImage(e.target.value)}
                  className="w-full p-2 bg-cafe-50 rounded-xl border border-cafe-200 text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Summary / Hook (Teaser for home page) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Short exciting 1-sentence teaser..."
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full p-2.5 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Full Project Content & Details *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed project info, agenda, perks, or menu additions..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full p-3 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-2 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full p-2 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-cafe-800 uppercase tracking-wider block mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full p-2 bg-cafe-50 rounded-xl border border-cafe-200 text-xs focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition mt-2"
              >
                {editingId ? 'Save Changes & Update Website' : 'Publish Project to Website'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
