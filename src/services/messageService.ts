
import { useAuth } from '@/contexts/AuthContext';
import { Message, saveMessage, getConversation } from './dataService';
import { fileToDataUrl, validateImageFile } from '@/utils/fileUtils';

export const useMessageService = () => {
  const { currentUser } = useAuth();
  
  const sendMessage = async (
    receiverId: string, 
    content: string, 
    imageFile?: File
  ): Promise<Message | null> => {
    if (!currentUser) return null;
    
    let imageUrl: string | undefined = undefined;
    
    // Process image file if provided
    if (imageFile) {
      if (!validateImageFile(imageFile)) {
        throw new Error('Invalid image file. Must be JPEG, PNG, GIF, or WebP and under 5MB.');
      }
      
      try {
        imageUrl = await fileToDataUrl(imageFile);
      } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image file');
      }
    }
    
    // Create and save message
    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: new Date(),
      imageUrl
    };
    
    return saveMessage(message);
  };
  
  const getMessages = (otherUserId: string): Message[] => {
    if (!currentUser) return [];
    return getConversation(currentUser.id, otherUserId);
  };
  
  return {
    sendMessage,
    getMessages
  };
};
