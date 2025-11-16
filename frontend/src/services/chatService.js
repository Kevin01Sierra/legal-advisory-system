export const chatService = {
  async sendQuery(query, conversationId, token) {
    return apiClient.post(
      '/legal-chat/query',
      { query, conversationId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  async getConversations(token) {
    return apiClient.get('/legal-chat/conversations', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getConversationHistory(conversationId, token) {
    return apiClient.get(`/legal-chat/conversations/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};