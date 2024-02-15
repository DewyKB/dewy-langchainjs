import {
    BaseRetriever,
    type BaseRetrieverInput,
  } from "@langchain/core/retrievers";
  import type { CallbackManagerForRetrieverRun } from "@langchain/core/callbacks/manager";
  import { Document } from "@langchain/core/documents";
  import { Dewy, TextResult } from 'dewy-ts'; 
  
  export interface DewyRetrieverInput extends BaseRetrieverInput {
    dewy: Dewy;
    collection: string;
    n?: number;
  }
  
  export class DewyRetriever extends BaseRetriever {
    lc_namespace: string[] = [];
    dewy: Dewy;
    collection: string;
    n: number;
  
    constructor(fields: DewyRetrieverInput) {
      super(fields);
      const { dewy, collection, n, ...rest } = fields;

      this.dewy = dewy;
      this.collection = collection;
      this.n = n ?? 10;
    }
  
    async _getRelevantDocuments(
      query: string,
      runManager?: CallbackManagerForRetrieverRun
    ): Promise<Document[]> {
        const context = await this.dewy.kb.retrieveChunks({
            collection: this.collection,
            query: query, 
            n: this.n,
        });

        const documents = context.text_results.map((chunk: TextResult) => {
            const { text, ...rest } = chunk;

            return new Document({
                pageContent: text, 
                metadata: rest,
            })
        });

        return documents
    }
  }
