// Configuration constants for message grid layout
export const MESSAGE_GRID_CONFIG = {
  MESSAGES_PER_ROW: 4, // Number of messages per row before wrapping
  MIN_CARD_WIDTH: 280, // Minimum width for each message card in pixels
  GAP: 20 // Gap between message cards in pixels
} as const;

// Utility functions for message positioning
export class MessageGridUtils {
  
  /**
   * Calculate grid row and column from position number
   */
  static getGridPosition(position: number, messagesPerRow: number = MESSAGE_GRID_CONFIG.MESSAGES_PER_ROW) {
    const row = Math.floor(position / messagesPerRow);
    const col = position % messagesPerRow;
    return { row, col };
  }

  /**
   * Calculate position number from row and column
   */
  static getPositionFromGrid(row: number, col: number, messagesPerRow: number = MESSAGE_GRID_CONFIG.MESSAGES_PER_ROW) {
    return row * messagesPerRow + col;
  }

  /**
   * Get the next available position for a new message
   */
  static getNextPosition(existingMessages: { position?: number }[]) {
    const positions = existingMessages
      .map(msg => msg.position)
      .filter(pos => pos !== undefined && pos !== null) as number[];
    
    if (positions.length === 0) {
      return 0;
    }

    // Find the next available position
    positions.sort((a, b) => a - b);
    
    for (let i = 0; i < positions.length; i++) {
      if (positions[i] !== i) {
        return i;
      }
    }
    
    return positions.length;
  }

  /**
   * Sort messages by position, with unpositioned messages at the end
   */
  static sortMessagesByPosition<T extends { position?: number }>(messages: T[]): T[] {
    return messages.sort((a, b) => {
      const posA = a.position ?? Number.MAX_SAFE_INTEGER;
      const posB = b.position ?? Number.MAX_SAFE_INTEGER;
      return posA - posB;
    });
  }

  /**
   * Calculate CSS grid styles for a specific number of columns
   */
  static getGridStyles(messagesPerRow: number = MESSAGE_GRID_CONFIG.MESSAGES_PER_ROW) {
    return {
      'grid-template-columns': `repeat(${messagesPerRow}, 1fr)`,
      'gap': `${MESSAGE_GRID_CONFIG.GAP}px`
    };
  }

  /**
   * Calculate responsive grid columns based on container width
   */
  static getResponsiveColumns(containerWidth: number): number {
    const availableWidth = containerWidth - (2 * MESSAGE_GRID_CONFIG.GAP); // Account for padding
    const minCardWithGap = MESSAGE_GRID_CONFIG.MIN_CARD_WIDTH + MESSAGE_GRID_CONFIG.GAP;
    const maxColumns = Math.floor(availableWidth / minCardWithGap);
    
    return Math.max(1, Math.min(maxColumns, MESSAGE_GRID_CONFIG.MESSAGES_PER_ROW));
  }
}