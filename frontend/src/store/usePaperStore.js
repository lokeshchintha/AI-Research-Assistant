import { create } from 'zustand';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const usePaperStore = create((set, get) => ({
  papers: [],
  currentPaper: null,
  isLoading: false,
  isUploading: false,

  fetchPapers: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/papers');
      set({ papers: data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to fetch papers');
    }
  },

  fetchPaper: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/papers/${id}`);
      set({ currentPaper: data.data, isLoading: false });
      return data.data;
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to fetch paper');
      return null;
    }
  },

  uploadPaper: async (file, title) => {
    set({ isUploading: true });
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      if (title) formData.append('title', title);

      const { data } = await api.post('/papers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      set((state) => ({
        papers: [data.data, ...state.papers],
        isUploading: false,
      }));

      toast.success('Paper uploaded successfully!');
      return data.data;
    } catch (error) {
      set({ isUploading: false });
      toast.error(error.response?.data?.message || 'Upload failed');
      return null;
    }
  },

  generateSummary: async (paperId) => {
    try {
      const { data } = await api.post(`/papers/${paperId}/summary`);
      
      set((state) => ({
        currentPaper: state.currentPaper
          ? { ...state.currentPaper, summary: data.data }
          : null,
      }));

      toast.success('Summary generated!');
      return data.data;
    } catch (error) {
      toast.error('Failed to generate summary');
      return null;
    }
  },

  generateIdeas: async (paperId) => {
    try {
      const { data } = await api.post(`/papers/${paperId}/ideas`);
      
      set((state) => ({
        currentPaper: state.currentPaper
          ? { ...state.currentPaper, ideas: data.data }
          : null,
      }));

      toast.success('Research ideas generated!');
      return data.data;
    } catch (error) {
      toast.error('Failed to generate ideas');
      return null;
    }
  },

  generateKnowledgeGraph: async (paperId) => {
    try {
      const { data } = await api.post(`/papers/${paperId}/knowledge-graph`);
      
      set((state) => ({
        currentPaper: state.currentPaper
          ? { ...state.currentPaper, knowledgeGraph: data.data }
          : null,
      }));

      toast.success('Knowledge graph generated!');
      return data.data;
    } catch (error) {
      toast.error('Failed to generate knowledge graph');
      return null;
    }
  },

  generateCitations: async (paperId) => {
    try {
      const { data } = await api.post(`/papers/${paperId}/citations`);
      
      set((state) => ({
        currentPaper: state.currentPaper
          ? { ...state.currentPaper, citations: data.data }
          : null,
      }));

      toast.success('Citations generated!');
      return data.data;
    } catch (error) {
      toast.error('Failed to generate citations');
      return null;
    }
  },

  generateSlides: async (paperId) => {
    try {
      const { data } = await api.post(`/papers/${paperId}/slides`);
      toast.success('Slides generated!');
      return data.data;
    } catch (error) {
      toast.error('Failed to generate slides');
      return null;
    }
  },

  generateAbstract: async (paperId) => {
    try {
      const { data } = await api.post(`/papers/${paperId}/abstract`);
      toast.success('Abstract generated!');
      return data.data;
    } catch (error) {
      toast.error('Failed to generate abstract');
      return null;
    }
  },

  askQuestion: async (paperId, question) => {
    try {
      const { data } = await api.post(`/papers/${paperId}/ask`, { question });
      return data.data;
    } catch (error) {
      toast.error('Failed to get answer');
      return null;
    }
  },

  addCollaborator: async (paperId, email) => {
    try {
      const { data } = await api.post(`/papers/${paperId}/collaborators`, { email });
      
      set((state) => ({
        currentPaper: state.currentPaper
          ? { ...state.currentPaper, collaborators: data.data.collaborators }
          : null,
      }));

      toast.success('Collaborator added!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add collaborator');
      return false;
    }
  },

  addNote: async (paperId, content) => {
    try {
      const { data } = await api.post(`/papers/${paperId}/notes`, { content });
      
      set((state) => ({
        currentPaper: state.currentPaper
          ? { ...state.currentPaper, notes: data.data }
          : null,
      }));

      return true;
    } catch (error) {
      toast.error('Failed to add note');
      return false;
    }
  },

  deletePaper: async (paperId) => {
    try {
      await api.delete(`/papers/${paperId}`);
      
      set((state) => ({
        papers: state.papers.filter((p) => p._id !== paperId),
        currentPaper: state.currentPaper?._id === paperId ? null : state.currentPaper,
      }));

      toast.success('Paper deleted');
      return true;
    } catch (error) {
      toast.error('Failed to delete paper');
      return false;
    }
  },

  generateFullPaper: async (ideaId) => {
    try {
      const { data } = await api.post(`/papers/ideas/${ideaId}/generate-paper`);
      
      // Update the current paper's ideas with the generated paper
      set((state) => {
        if (state.currentPaper && state.currentPaper.ideas) {
          const updatedIdeas = state.currentPaper.ideas.map((idea) =>
            idea._id === ideaId ? { ...idea, generatedPaper: data.data, generatedAt: new Date() } : idea
          );
          return {
            currentPaper: { ...state.currentPaper, ideas: updatedIdeas },
          };
        }
        return state;
      });

      toast.success('Full research paper generated!');
      return data.data;
    } catch (error) {
      toast.error('Failed to generate full paper');
      throw error;
    }
  },

  generateIdeaSlides: async (ideaId, options) => {
    try {
      const { data } = await api.post(`/papers/ideas/${ideaId}/generate-slides`, options);
      
      // Update the current paper's ideas with the generated slides
      set((state) => {
        if (state.currentPaper && state.currentPaper.ideas) {
          const updatedIdeas = state.currentPaper.ideas.map((idea) =>
            idea._id === ideaId ? { ...idea, generatedSlides: data.data } : idea
          );
          return {
            currentPaper: { ...state.currentPaper, ideas: updatedIdeas },
          };
        }
        return state;
      });

      toast.success('Presentation slides generated!');
      return data.data;
    } catch (error) {
      toast.error('Failed to generate slides');
      throw error;
    }
  },

  generateMoreIdeas: async (paperId, count = 3) => {
    try {
      const { data } = await api.post(`/papers/${paperId}/ideas/more`, { count });
      
      // Append new ideas to existing ones
      set((state) => {
        if (state.currentPaper && state.currentPaper._id === paperId) {
          return {
            currentPaper: {
              ...state.currentPaper,
              ideas: [...(state.currentPaper.ideas || []), ...data.data],
            },
          };
        }
        return state;
      });

      toast.success(`${data.data.length} more ideas generated!`);
      return data.data;
    } catch (error) {
      toast.error('Failed to generate more ideas');
      throw error;
    }
  },

  modifyIdeaPaper: async (ideaId, modificationRequest) => {
    try {
      const { data } = await api.post(`/papers/ideas/${ideaId}/modify-paper`, { modificationRequest });
      
      // Update the current paper's ideas with the modified paper
      set((state) => {
        if (state.currentPaper && state.currentPaper.ideas) {
          const updatedIdeas = state.currentPaper.ideas.map((idea) =>
            idea._id === ideaId ? { ...idea, generatedPaper: data.data, generatedAt: new Date() } : idea
          );
          return {
            currentPaper: { ...state.currentPaper, ideas: updatedIdeas },
          };
        }
        return state;
      });

      toast.success('Paper modified successfully!');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to modify paper');
      throw error;
    }
  },

  modifyIdeaSlides: async (ideaId, modificationRequest, options = {}) => {
    try {
      const { data } = await api.post(`/papers/ideas/${ideaId}/modify-slides`, { 
        modificationRequest,
        ...options 
      });
      
      // Update the current paper's ideas with the modified slides
      set((state) => {
        if (state.currentPaper && state.currentPaper.ideas) {
          const updatedIdeas = state.currentPaper.ideas.map((idea) =>
            idea._id === ideaId ? { ...idea, generatedSlides: data.data } : idea
          );
          return {
            currentPaper: { ...state.currentPaper, ideas: updatedIdeas },
          };
        }
        return state;
      });

      toast.success('Slides modified successfully!');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to modify slides');
      throw error;
    }
  },
}));

export default usePaperStore;
