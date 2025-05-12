"use client";
import { PropertyGpt } from "@/app/constant";
import { getHeaders, LLMModel } from "../api";
import { ChatOptions, LLMApi } from "../api";
import { getMessageTextContent } from "@/app/utils";

export class PropertyGptApi implements LLMApi {
  async chat(options: ChatOptions) {
    const payload = {
      messages: options.messages.map((m) => ({
        role: m.role,
        content: getMessageTextContent(m),
      })),
      model: options.config.model,
      temperature: 0.7,
      max_tokens: 2048,
    };

    console.log("PropertyGptApi.chat", options, "payload: ", payload);

    const controller = new AbortController();
    options.onController?.(controller);

    try {
      const path = `${PropertyGpt.BaseUrl}${PropertyGpt.ChatPath}`;

      const res = await fetch(path, {
        method: "POST",
        body: JSON.stringify(payload),
        signal: controller.signal,
        headers: getHeaders(),
        credentials: "include",
      });

      const resJson = await res.json();

      if (!res.ok) {
        options.onError?.(
          new Error(`HTTP ${res.status}: ${resJson?.error?.message}`),
        );
        return;
      }

      const message = resJson.choices?.[0]?.message?.content || "";
      options.onFinish(message, res);
    } catch (e) {
      options.onError?.(e as Error);
    }
  }

  async getHistorySessions() {
    const path = `${PropertyGpt.BaseUrl}${PropertyGpt.HistorySessionPath}`;
    try {
      const response = await fetch(path, {
        headers: getHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch history sessions:", error);
      throw error;
    }
  }

  // Implement these with empty methods since your model doesn't support them
  async usage() {
    return { used: 0, total: 0 };
  }
  async models(): Promise<LLMModel[]> {
    let seq = 1000;
    return [
      {
        name: "PropertyGPT",
        available: true,
        sorted: seq++,
        provider: {
          id: "PropertyGPT",
          providerName: "PropertyGPT",
          providerType: "PropertyGPT",
          sorted: 15,
        },
      },
    ];
  }
  async speech() {
    return new ArrayBuffer(0);
  }
}
