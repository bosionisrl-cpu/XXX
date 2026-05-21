
export interface PipelineStatus {
  scrapingThroughput: number;
  embeddingThroughput: number;
  gpuUtilization: number;
  vramUsage: number;
  queueStatus: {
    generation: number;
    embedding: number;
    scraping: number;
  };
}
