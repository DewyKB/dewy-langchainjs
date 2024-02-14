# Dewy Langchain Integration

This package provides Dewy integration for Langchain.js.

Example:

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { Dewy } from 'dewy-ts'; 
import { DewyRetriever } from 'dewy-langchain'; 

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY
});
const dewy = new Dewy({
    BASE: process.env.DEWY_ENDPOINT
});

collection_id = 1;
const retriever = new DewyRetriever({ dewy, collection_id });

const prompt =
PromptTemplate.fromTemplate(`Answer the question based only on the following context:
{context}

Question: {question}`);

const chain = RunnableSequence.from([
    {
        context: retriever.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough(),
    },
    prompt,
    model,
    new StringOutputParser(),
]);
``` 
