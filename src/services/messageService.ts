
import { useAuth } from '@/contexts/AuthContext';
import { Message, saveMessage, getConversation } from './dataService';
import { fileToDataUrl, validateImageFile, validateVideoFile, validatePdfFile } from '@/utils/fileUtils';

export const useMessageService = () => {
  const { currentUser } = useAuth();
  
  const sendMessage = async (
    receiverId: string, 
    content: string, 
    mediaFile?: File,
    audioBlob?: Blob,
    isStory?: boolean
  ): Promise<Message | null> => {
    if (!currentUser) return null;
    
    let imageUrl: string | undefined = undefined;
    let videoUrl: string | undefined = undefined;
    let fileUrl: string | undefined = undefined;
    let fileType: string | undefined = undefined;
    let audioUrl: string | undefined = undefined;
    
    // Process media file if provided
    if (mediaFile) {
      try {
        if (mediaFile.type.startsWith('image/') && validateImageFile(mediaFile)) {
          imageUrl = await fileToDataUrl(mediaFile);
        } else if (mediaFile.type.startsWith('video/') && validateVideoFile(mediaFile)) {
          videoUrl = await fileToDataUrl(mediaFile);
        } else if (mediaFile.type === 'application/pdf' && validatePdfFile(mediaFile)) {
          fileUrl = await fileToDataUrl(mediaFile);
          fileType = 'pdf';
        } else {
          throw new Error('Invalid file type');
        }
      } catch (error) {
        console.error('Error processing media:', error);
        throw new Error('Failed to process media file');
      }
    }
    
    // Process audio blob if provided
    if (audioBlob) {
      try {
        const reader = new FileReader();
        audioUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(audioBlob);
        });
      } catch (error) {
        console.error('Error processing audio:', error);
        throw new Error('Failed to process audio file');
      }
    }
    
    // Create and save message
    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: new Date(),
      imageUrl,
      videoUrl,
      fileUrl,
      fileType,
      audioUrl,
      isStory: isStory || false
    };
    
    return saveMessage(message);
  };
  
  const getMessages = (otherUserId: string, includeStories = false): Message[] => {
    if (!currentUser) return [];
    const messages = getConversation(currentUser.id, otherUserId);
    return includeStories ? messages : messages.filter(message => !message.isStory);
  };
  
  const createStory = async (content: string, mediaFile?: File): Promise<Message | null> => {
    // Special receiver ID for stories - they're visible to all friends
    return sendMessage('stories', content, mediaFile, undefined, true);
  };
  
  const getStories = (): Message[] => {
    if (!currentUser) return [];
    return getConversation(currentUser.id, 'stories');
  };
  
  return {
    sendMessage,
    getMessages,
    createStory,
    getStories
  };
};
