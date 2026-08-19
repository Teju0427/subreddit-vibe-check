import { describe, expect, it } from "vitest";
import {
  analyzeTitle,
  analyzePosts,
  summarizeSentiment,
} from "../utils/sentiment.js";

describe("sentiment analysis", () => {
  it("classifies a clearly positive title as positive", () => {
  const result = analyzeTitle("I love this amazing victory!");

  expect(result.label).toBe("positive");
  expect(result.score).toBeGreaterThan(0);
});

  it("classifies a clearly negative title as negative", () => {
    const result = analyzeTitle("This is a terrible disaster!");

    expect(result.label).toBe("negative");
    expect(result.score).toBeLessThan(0);
  });

  it("classifies a neutral title as neutral", () => {
    const result = analyzeTitle("The team announced the new schedule today.");

    expect(result.label).toBe("neutral");
    expect(result.score).toBe(0);
  });

  it("analyzes multiple posts without modifying the originals", () => {
    const posts = [
      { id: "1", title: "Amazing victory!" },
      { id: "2", title: "Terrible loss!" },
    ];

    const analyzed = analyzePosts(posts);

    expect(analyzed).toHaveLength(2);
    expect(analyzed[0].sentimentLabel).toBe("positive");
    expect(analyzed[1].sentimentLabel).toBe("negative");

    expect(posts[0]).not.toHaveProperty("sentimentLabel");
    expect(posts[1]).not.toHaveProperty("sentimentLabel");
  });

  it("correctly summarizes analyzed posts", () => {
    const posts = [
      { sentimentLabel: "positive", sentimentScore: 2 },
      { sentimentLabel: "neutral", sentimentScore: 0 },
      { sentimentLabel: "negative", sentimentScore: -1 },
    ];

    const summary = summarizeSentiment(posts);

    expect(summary.total).toBe(3);
    expect(summary.counts.positive).toBe(1);
    expect(summary.counts.neutral).toBe(1);
    expect(summary.counts.negative).toBe(1);
    expect(summary.averageScore).toBe(1 / 3);
  });
});