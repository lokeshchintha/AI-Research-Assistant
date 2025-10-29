import { getGeminiModel } from '../config/gemini.js';

class GeminiService {
  constructor() {
    this.model = getGeminiModel('gemini-2.0-flash');
  }

  // Generate summary at different complexity levels with structured bullet points
  async generateSummary(text, section, level = 'medium') {
    const prompts = {
      basic: `Summarize the following ${section} section from a research paper in simple, easy-to-understand language suitable for high school students.

CRITICAL FORMATTING REQUIREMENT:
You MUST format your response ONLY as bullet points. Each line must start with a bullet point symbol (•).
Do NOT write paragraphs or continuous text.
Do NOT use asterisks (*) - use bullet points (•) only.

Format example:
• First main point explained simply
• Second main point explained simply
• Third main point explained simply

Provide 5-6 bullet points total.
Use everyday language and avoid technical jargon.

${section} content:
${text}`,
      
      medium: `Summarize the following ${section} section from a research paper for undergraduate students. Balance technical accuracy with clarity.

CRITICAL FORMATTING REQUIREMENT:
You MUST format your response ONLY as bullet points. Each line must start with a bullet point symbol (•).
Do NOT write paragraphs or continuous text.
Do NOT use asterisks (*) - use bullet points (•) only.

Format example:
• First key point with relevant technical details
• Second key point with data or methodology
• Third key point with findings or implications

Provide 5-8 comprehensive bullet points.
Include important data, methods, or findings in each point.

${section} content:
${text}`,
      
      technical: `Provide a detailed technical summary of the following ${section} section from a research paper, maintaining all technical terminology and specifics.

CRITICAL FORMATTING REQUIREMENT:
You MUST format your response ONLY as bullet points. Each line must start with a bullet point symbol (•).
Do NOT write paragraphs or continuous text.
Do NOT use asterisks (*) - use bullet points (•) only.

Format example:
• Methodology: Specific algorithm name with parameters (e.g., learning rate=0.001)
• Dataset: Size, composition, and preprocessing steps
• Results: Quantitative metrics (e.g., accuracy=95.2%, F1-score=0.89)

Provide 8-12 detailed technical bullet points.
Include:
• Specific methodologies and algorithms with parameters
• Quantitative results with exact metrics
• Technical configurations and settings
• Statistical significance (p-values, confidence intervals)
• Mathematical formulas in text format

${section} content:
${text}`,
    };

    try {
      const result = await this.model.generateContent(prompts[level]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary');
    }
  }

  // Extract sections from paper text
  async extractSections(fullText) {
    const prompt = `Analyze the following research paper and extract these sections: Abstract, Introduction, Methods/Methodology, Results, and Conclusion. 
    Return the response in JSON format with keys: abstract, introduction, methods, results, conclusion. 
    If a section is not found, return an empty string for that key.
    
    Paper text:
    ${fullText.substring(0, 15000)}`; // Limit text length

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON, fallback to basic extraction
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed, using text response');
      }
      
      return {
        abstract: text.substring(0, 500),
        introduction: '',
        methods: '',
        results: '',
        conclusion: '',
      };
    } catch (error) {
      console.error('Error extracting sections:', error);
      throw new Error('Failed to extract sections');
    }
  }

  // Extract key findings in bullet point format
  async extractKeyFindings(fullText) {
    const prompt = `Analyze this research paper and extract the most important key findings.

IMPORTANT: Format your response as clear, concise bullet points (8-12 points):
• Key finding 1 with specific data/results
• Key finding 2 with specific data/results
• Key finding 3 with specific data/results
(Continue with more findings)

Focus on:
- Main discoveries and results
- Quantitative outcomes (numbers, percentages, metrics)
- Novel contributions
- Practical implications
- Limitations identified

Paper text:
${fullText.substring(0, 12000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract bullet points
      const bullets = text.split('\n')
        .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.trim().replace(/^[•\-*]\s*/, ''))
        .filter(line => line.length > 0);
      
      return bullets.length > 0 ? bullets : [text];
    } catch (error) {
      console.error('Error extracting key findings:', error);
      return ['Unable to extract key findings at this time.'];
    }
  }

  // Generate research ideas
  async generateResearchIdeas(paperText, count = 5) {
    const prompt = `Based on the following research paper, generate ${count} innovative research ideas that could extend or build upon this work. 
    For each idea, provide:
    1. Title (concise and descriptive)
    2. Description (2-3 sentences)
    3. Novelty level (Low/Medium/High)
    4. Feasibility (Low/Medium/High)
    5. AI Relevance (Low/Medium/High)
    6. Methodology (brief approach)
    7. Expected outcome
    8. Required resources (list 2-3 items)
    
    Return as JSON array with these fields: title, description, novelty, feasibility, aiRelevance, methodology, expectedOutcome, resources (array).
    
    Paper excerpt:
    ${paperText.substring(0, 10000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed for ideas');
      }
      
      // Fallback: generate simple ideas
      return this.generateFallbackIdeas(count);
    } catch (error) {
      console.error('Error generating ideas:', error);
      throw new Error('Failed to generate research ideas');
    }
  }

  generateFallbackIdeas(count) {
    const ideas = [];
    const templates = [
      'Extending the methodology with deep learning approaches',
      'Applying the findings to real-world applications',
      'Investigating limitations and edge cases',
      'Cross-domain application of the techniques',
      'Optimization and scalability improvements',
    ];

    for (let i = 0; i < Math.min(count, templates.length); i++) {
      ideas.push({
        title: templates[i],
        description: 'This research idea builds upon the original paper by exploring new dimensions and applications.',
        novelty: 'Medium',
        feasibility: 'Medium',
        aiRelevance: 'High',
        methodology: 'Experimental and analytical approach',
        expectedOutcome: 'Novel insights and improved performance',
        resources: ['Computing resources', 'Dataset access', 'Collaboration'],
      });
    }
    return ideas;
  }

  // Answer questions about the paper
  async answerQuestion(question, paperText) {
    const prompt = `You are an AI assistant helping students understand a research paper. 
    Answer the following question based on the paper content in a structured, point-wise format.
    
    IMPORTANT FORMATTING RULES:
    1. Start with a brief 1-sentence overview
    2. Then provide detailed points using bullet format (•)
    3. Each point should be clear and concise
    4. Use 3-7 bullet points depending on complexity
    5. Include specific details, numbers, or examples where relevant
    6. End with a brief conclusion if needed
    
    Example format:
    [Brief overview sentence]
    
    • Point 1: Detailed explanation
    • Point 2: Specific information with data
    • Point 3: Key finding or methodology
    • Point 4: Additional context
    
    [Optional conclusion]
    
    Question: ${question}
    
    Paper content:
    ${paperText.substring(0, 12000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error('Failed to answer question');
    }
  }

  // Extract keywords for knowledge graph
  async extractKeywords(paperText) {
    const prompt = `Extract 15-20 key technical terms, concepts, and topics from this research paper. 
    Return only a JSON array of strings, no additional text.
    
    Paper excerpt:
    ${paperText.substring(0, 8000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed for keywords');
      }
      
      // Fallback: extract words from text
      const words = paperText.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
      return [...new Set(words)].slice(0, 15);
    } catch (error) {
      console.error('Error extracting keywords:', error);
      return [];
    }
  }

  // Generate citation recommendations
  async generateCitations(paperText) {
    const prompt = `Based on this research paper, suggest 5 related papers that would be relevant citations. 
    For each paper, provide:
    - title
    - authors (array of names)
    - abstract (brief, 2-3 sentences)
    - year (estimated)
    - url (use format: https://scholar.google.com/scholar?q=TITLE)
    
    Return as JSON array.
    
    Paper excerpt:
    ${paperText.substring(0, 8000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed for citations');
      }
      
      return this.generateFallbackCitations();
    } catch (error) {
      console.error('Error generating citations:', error);
      return this.generateFallbackCitations();
    }
  }

  generateFallbackCitations() {
    return [
      {
        title: 'Related Research in the Field',
        authors: ['Smith, J.', 'Doe, A.'],
        abstract: 'This paper explores related concepts and methodologies in the field.',
        year: 2023,
        url: 'https://scholar.google.com/scholar',
      },
    ];
  }

  // Generate presentation slides content
  async generateSlides(paperText) {
    const prompt = `Create presentation slide content for this research paper. 
    Generate 8-10 slides with:
    - Slide title
    - 3-5 bullet points per slide
    
    Return as JSON array with format: [{title: string, points: string[]}]
    
    Paper excerpt:
    ${paperText.substring(0, 10000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed for slides');
      }
      
      return text;
    } catch (error) {
      console.error('Error generating slides:', error);
      throw new Error('Failed to generate slides');
    }
  }

  // Generate new abstract
  async generateAbstract(paperText) {
    const prompt = `Write a clear, concise academic abstract (150-200 words) for this research paper. 
    Include: background, objective, methods, key results, and conclusion.
    
    Paper content:
    ${paperText.substring(0, 10000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating abstract:', error);
      throw new Error('Failed to generate abstract');
    }
  }

  // Feature 9: AI Insight Analyzer - Evaluate paper's novelty, strengths, limitations
  async analyzeInsights(paperText) {
    const prompt = `Analyze this research paper comprehensively and provide insights in the following categories:

Return as JSON with this exact structure:
{
  "novelty": {
    "score": 1-10,
    "description": "Brief explanation of novelty",
    "points": ["Point 1", "Point 2", "Point 3"]
  },
  "methodStrength": {
    "score": 1-10,
    "description": "Assessment of methodology",
    "points": ["Point 1", "Point 2", "Point 3"]
  },
  "practicalRelevance": {
    "score": 1-10,
    "description": "Real-world applicability",
    "points": ["Point 1", "Point 2", "Point 3"]
  },
  "limitations": {
    "score": 1-10,
    "description": "Overall limitation assessment",
    "points": ["Limitation 1", "Limitation 2", "Limitation 3"]
  },
  "overallScore": 1-10,
  "recommendation": "Brief recommendation for readers"
}

Paper content:
${paperText.substring(0, 12000)}`;

    try {
      console.log('🔍 Analyzing insights for paper...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('📊 Insights response received, length:', text.length);
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log('✅ Insights parsed successfully:', Object.keys(parsed));
          return parsed;
        } else {
          console.log('⚠️ No JSON found in response, using fallback');
        }
      } catch (e) {
        console.log('❌ JSON parse failed for insights:', e.message);
        console.log('Raw response:', text.substring(0, 500));
      }
      
      // Fallback with better data
      console.log('📋 Using fallback insights');
      return {
        novelty: { 
          score: 7, 
          description: 'The paper presents a moderately novel approach', 
          points: [
            'Introduces new methodology or framework',
            'Builds upon existing research',
            'Provides fresh perspective on the problem'
          ] 
        },
        methodStrength: { 
          score: 7, 
          description: 'Solid and well-structured methodology', 
          points: [
            'Clear research design',
            'Appropriate methods for the problem',
            'Rigorous experimental setup'
          ] 
        },
        practicalRelevance: { 
          score: 7, 
          description: 'Has practical applications in the field', 
          points: [
            'Addresses real-world problems',
            'Potential for industry application',
            'Contributes to practical knowledge'
          ] 
        },
        limitations: { 
          score: 6, 
          description: 'Some limitations present but manageable', 
          points: [
            'Limited dataset or sample size',
            'Scope could be broader',
            'Some assumptions may need validation'
          ] 
        },
        overallScore: 7,
        recommendation: 'Worth reading for researchers and practitioners in the field. Provides valuable insights and contributions.'
      };
    } catch (error) {
      console.error('❌ Error analyzing insights:', error);
      throw new Error('Failed to analyze insights');
    }
  }

  // Feature 10: Research Comparison Tool - Compare two papers
  async comparePapers(paper1Text, paper2Text, paper1Title, paper2Title) {
    const prompt = `Compare these two research papers across multiple dimensions:

Paper 1: ${paper1Title}
Paper 2: ${paper2Title}

Return as JSON with this structure:
{
  "methodology": {
    "paper1": "Description",
    "paper2": "Description",
    "comparison": "Key differences"
  },
  "datasets": {
    "paper1": "Dataset info",
    "paper2": "Dataset info",
    "comparison": "Key differences"
  },
  "results": {
    "paper1": "Main results",
    "paper2": "Main results",
    "comparison": "Performance comparison"
  },
  "novelty": {
    "paper1": "Novelty assessment",
    "paper2": "Novelty assessment",
    "comparison": "Which is more novel"
  },
  "strengths": {
    "paper1": ["Strength 1", "Strength 2"],
    "paper2": ["Strength 1", "Strength 2"]
  },
  "weaknesses": {
    "paper1": ["Weakness 1", "Weakness 2"],
    "paper2": ["Weakness 1", "Weakness 2"]
  },
  "recommendation": "Which paper is better for what purpose"
}

Paper 1 content:
${paper1Text.substring(0, 8000)}

Paper 2 content:
${paper2Text.substring(0, 8000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed for comparison');
      }
      
      return { error: 'Failed to parse comparison' };
    } catch (error) {
      console.error('Error comparing papers:', error);
      throw new Error('Failed to compare papers');
    }
  }

  // Feature 11: Quiz Generator - Generate MCQs from paper
  async generateQuiz(paperText, questionCount = 5) {
    const prompt = `Generate ${questionCount} multiple-choice questions (MCQs) based on this research paper.

Return as JSON array with this structure:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this is correct",
    "difficulty": "Easy/Medium/Hard",
    "topic": "Section/topic covered"
  }
]

Make questions test understanding of:
- Key concepts
- Methodology
- Results and findings
- Implications

Paper content:
${paperText.substring(0, 10000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed for quiz');
      }
      
      // Fallback quiz
      return [{
        question: 'What is the main contribution of this paper?',
        options: ['Novel algorithm', 'New dataset', 'Theoretical framework', 'Application'],
        correctAnswer: 0,
        explanation: 'Based on the paper content',
        difficulty: 'Medium',
        topic: 'Main Contribution'
      }];
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  // Generate knowledge graph data
  async generateKnowledgeGraph(paperText) {
    const prompt = `Extract key concepts and their relationships from this research paper for a knowledge graph.

Return as JSON with this structure:
{
  "nodes": [
    {"id": "concept1", "label": "Concept Name", "group": 1},
    {"id": "concept2", "label": "Another Concept", "group": 2}
  ],
  "links": [
    {"source": "concept1", "target": "concept2", "value": 1}
  ]
}

Groups: 1=Methods, 2=Results, 3=Concepts, 4=Applications, 5=Related

Extract 15-25 key concepts and their relationships.

Paper content:
${paperText.substring(0, 10000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed for knowledge graph');
      }
      
      // Fallback: use keywords
      const keywords = await this.extractKeywords(paperText);
      const nodes = keywords.slice(0, 15).map((kw, i) => ({
        id: `node${i}`,
        label: kw,
        group: (i % 5) + 1
      }));
      
      const links = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        if (Math.random() > 0.5) {
          links.push({
            source: nodes[i].id,
            target: nodes[i + 1].id,
            value: 1
          });
        }
      }
      
      return { nodes, links };
    } catch (error) {
      console.error('Error generating knowledge graph:', error);
      throw new Error('Failed to generate knowledge graph');
    }
  }

  // Feature 12: Full Research Paper Generator - Generate complete research paper from idea
  async generateFullPaper(idea, sourcePaperText) {
    const prompt = `Based on this research idea and the source paper context, generate a complete research paper proposal.

Research Idea:
Title: ${idea.title}
Description: ${idea.description}
Category: ${idea.category}
Impact: ${idea.impact}
Feasibility: ${idea.feasibility}

Source Paper Context (for reference):
${sourcePaperText.substring(0, 3000)}

Generate a comprehensive research paper proposal with the following sections. Return as JSON:

{
  "abstract": "150-250 word abstract summarizing the research",
  "introduction": {
    "background": "Background and context (2-3 paragraphs)",
    "problemStatement": "Clear problem statement",
    "objectives": ["Objective 1", "Objective 2", "Objective 3"],
    "significance": "Why this research matters"
  },
  "literatureReview": {
    "summary": "Overview of existing research (3-4 paragraphs)",
    "gaps": ["Gap 1", "Gap 2", "Gap 3"],
    "positioning": "How this research fills the gaps"
  },
  "methodology": {
    "approach": "Overall research approach",
    "methods": ["Method 1 with details", "Method 2 with details", "Method 3 with details"],
    "dataCollection": "Data collection strategy",
    "analysis": "Analysis techniques",
    "timeline": "Estimated timeline"
  },
  "expectedResults": {
    "outcomes": ["Expected outcome 1", "Expected outcome 2", "Expected outcome 3"],
    "metrics": ["Metric 1", "Metric 2", "Metric 3"],
    "validation": "How results will be validated"
  },
  "conclusion": {
    "summary": "Summary of the proposal",
    "contributions": ["Contribution 1", "Contribution 2", "Contribution 3"],
    "futureWork": "Potential future directions"
  },
  "references": [
    "Reference 1 (based on source paper and related work)",
    "Reference 2",
    "Reference 3",
    "Reference 4",
    "Reference 5"
  ]
}

Make it detailed, academic, and publication-ready.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed for paper generation');
      }
      
      return { error: 'Failed to parse generated paper' };
    } catch (error) {
      console.error('Error generating full paper:', error);
      throw new Error('Failed to generate full research paper');
    }
  }

  // Modify existing research paper based on user instructions
  async modifyResearchPaper(currentPaper, modificationRequest, idea) {
    const prompt = `You are modifying an existing research paper based on user feedback.

Current Paper:
Title: ${idea.title}
Abstract: ${currentPaper.abstract}

Current Sections:
- Introduction: ${JSON.stringify(currentPaper.introduction)}
- Literature Review: ${JSON.stringify(currentPaper.literatureReview)}
- Methodology: ${JSON.stringify(currentPaper.methodology)}
- Expected Results: ${JSON.stringify(currentPaper.expectedResults)}
- Conclusion: ${JSON.stringify(currentPaper.conclusion)}

User's Modification Request:
"${modificationRequest}"

Please modify the paper according to the user's request and return the COMPLETE updated paper in the EXACT same JSON format:
{
  "abstract": "string",
  "introduction": {
    "background": "string",
    "problemStatement": "string",
    "objectives": ["string"],
    "significance": "string"
  },
  "literatureReview": {
    "summary": "string",
    "gaps": ["string"],
    "positioning": "string"
  },
  "methodology": {
    "approach": "string",
    "methods": ["string"],
    "dataCollection": "string",
    "analysis": "string",
    "timeline": "string"
  },
  "expectedResults": {
    "outcomes": ["string"],
    "metrics": ["string"],
    "validation": "string"
  },
  "conclusion": {
    "summary": "string",
    "contributions": ["string"],
    "futureWork": "string"
  },
  "references": ["string"]
}

Return ONLY the JSON object, no additional text.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed for paper modification');
      }
      
      return { error: 'Failed to parse modified paper' };
    } catch (error) {
      console.error('Error modifying paper:', error);
      throw new Error('Failed to modify research paper');
    }
  }

  // Modify existing slides based on user instructions
  async modifySlideContent(currentSlides, modificationRequest, idea, options = {}) {
    const { theme = 'Professional', layout = 'Mixed', slideCount = currentSlides.length } = options;

    const prompt = `You are modifying an existing PowerPoint presentation based on user feedback.

Current Presentation:
Title: ${idea.title}
Number of Slides: ${currentSlides.length}
Theme: ${theme}
Layout: ${layout}

Current Slides:
${JSON.stringify(currentSlides, null, 2)}

User's Modification Request:
"${modificationRequest}"

Please modify the slides according to the user's request and return the COMPLETE updated presentation as a JSON array.
Maintain the same structure for each slide:
{
  "slideNumber": number,
  "title": "string",
  "subtitle": "string (optional)",
  "layout": "title|bullets|two-column|image-text|conclusion",
  "content": object (varies by layout),
  "visualSuggestion": "string",
  "speakerNotes": "string"
}

Return ONLY the JSON array, no additional text.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed for slides modification');
      }
      
      return { error: 'Failed to parse modified slides' };
    } catch (error) {
      console.error('Error modifying slides:', error);
      throw new Error('Failed to modify presentation slides');
    }
  }

  // Feature 13: PowerPoint Slide Generator - Generate presentation slides from idea
  async generateSlideContent(idea, sourcePaperText, options = {}) {
    const { theme = 'Professional', layout = 'Mixed', slideCount = 10 } = options;

    const prompt = `Generate a ${slideCount}-slide PowerPoint presentation for this research idea.

Research Idea:
Title: ${idea.title}
Description: ${idea.description}
Category: ${idea.category}
Impact: ${idea.impact}
Feasibility: ${idea.feasibility}

Source Paper Context:
${sourcePaperText.substring(0, 2000)}

Presentation Requirements:
- Theme: ${theme} (${theme === 'Professional' ? 'Corporate blue/gray colors, formal' : theme === 'Minimal' ? 'Clean white/black, simple' : theme === 'Dark' ? 'Dark backgrounds, neon accents' : 'Futuristic gradients, modern'})
- Layout: ${layout} (${layout === 'Text-heavy' ? 'More bullet points, detailed text' : layout === 'Visual' ? 'Focus on diagrams, minimal text' : 'Balance of text and visuals'})
- Total Slides: ${slideCount}

Generate a presentation with the following structure. Return as JSON array:

[
  {
    "slideNumber": 1,
    "title": "Title Slide",
    "subtitle": "Research Proposal",
    "content": {
      "mainTitle": "${idea.title}",
      "subtitle": "Presented by [Your Name]",
      "date": "Date",
      "notes": "Opening slide with title and presenter info"
    },
    "layout": "title",
    "visualSuggestion": "Background image or gradient related to the topic"
  },
  {
    "slideNumber": 2,
    "title": "Agenda / Overview",
    "content": {
      "items": ["Introduction", "Problem Statement", "Objectives", "Methodology", "Expected Results", "Conclusion"],
      "notes": "Outline of presentation structure"
    },
    "layout": "bullets",
    "visualSuggestion": "Timeline or roadmap graphic"
  },
  // Continue with slides covering:
  // - Introduction/Background (1-2 slides)
  // - Problem Statement (1 slide)
  // - Research Objectives (1 slide)
  // - Literature Review/Related Work (1 slide)
  // - Proposed Methodology (2-3 slides)
  // - Expected Results/Impact (1-2 slides)
  // - Timeline/Resources (1 slide)
  // - Conclusion/Future Work (1 slide)
  // - Q&A/Thank You (1 slide)
]

For each slide include:
- slideNumber: Sequential number
- title: Slide title
- subtitle: Optional subtitle
- content: Main content (bullets, paragraphs, or structured data)
- layout: "title" | "bullets" | "two-column" | "image-text" | "full-text" | "comparison"
- visualSuggestion: What image/diagram would work well
- speakerNotes: What to say when presenting this slide

Make content ${layout === 'Text-heavy' ? 'detailed with more bullet points' : layout === 'Visual' ? 'concise with focus on visual descriptions' : 'balanced between text and visuals'}.
Ensure exactly ${slideCount} slides total.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('JSON parse failed for slide generation');
      }
      
      return { error: 'Failed to parse generated slides' };
    } catch (error) {
      console.error('Error generating slides:', error);
      throw new Error('Failed to generate presentation slides');
    }
  }
}

export default new GeminiService();
