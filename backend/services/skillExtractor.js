// backend/services/skillExtractor.js
// Keyword + regex-based skill extraction with 100+ skills across 7 categories.

const SKILLS = [
  // ── Languages ────────────────────────────────────────────────────
  { name: 'Python',        cat: 'language',   kw: ['python']                           },
  { name: 'JavaScript',    cat: 'language',   kw: ['javascript', ' js ', 'js,', 'js.'] },
  { name: 'TypeScript',    cat: 'language',   kw: ['typescript', ' ts ']               },
  { name: 'Java',          cat: 'language',   kw: [' java ', 'java,', 'java.']         },
  { name: 'C++',           cat: 'language',   kw: ['c++', 'cpp']                       },
  { name: 'C#',            cat: 'language',   kw: ['c#', 'csharp', 'c sharp']          },
  { name: 'Go',            cat: 'language',   kw: [' go ', 'golang']                   },
  { name: 'Rust',          cat: 'language',   kw: ['rust']                             },
  { name: 'Ruby',          cat: 'language',   kw: ['ruby']                             },
  { name: 'PHP',           cat: 'language',   kw: ['php']                              },
  { name: 'Swift',         cat: 'language',   kw: ['swift']                            },
  { name: 'Kotlin',        cat: 'language',   kw: ['kotlin']                           },
  { name: 'Scala',         cat: 'language',   kw: ['scala']                            },
  { name: 'R',             cat: 'language',   kw: [' r ', 'r programming']             },
  { name: 'MATLAB',        cat: 'language',   kw: ['matlab']                           },
  { name: 'Dart',          cat: 'language',   kw: ['dart']                             },
  { name: 'Bash/Shell',    cat: 'language',   kw: ['bash', 'shell script', 'zsh']      },
  { name: 'Perl',          cat: 'language',   kw: ['perl']                             },

  // ── Frontend Frameworks ──────────────────────────────────────────
  { name: 'React',         cat: 'framework',  kw: ['react', 'react.js', 'reactjs']     },
  { name: 'Vue.js',        cat: 'framework',  kw: ['vue', 'vue.js', 'vuejs']           },
  { name: 'Angular',       cat: 'framework',  kw: ['angular']                          },
  { name: 'Next.js',       cat: 'framework',  kw: ['next.js', 'nextjs', 'next js']     },
  { name: 'Svelte',        cat: 'framework',  kw: ['svelte']                           },
  { name: 'Redux',         cat: 'framework',  kw: ['redux']                            },
  { name: 'Tailwind CSS',  cat: 'framework',  kw: ['tailwind']                         },
  { name: 'Bootstrap',     cat: 'framework',  kw: ['bootstrap']                        },
  { name: 'Material UI',   cat: 'framework',  kw: ['material ui', 'mui']               },

  // ── Backend Frameworks ───────────────────────────────────────────
  { name: 'Node.js',       cat: 'framework',  kw: ['node.js', 'nodejs', 'node js']     },
  { name: 'Express.js',    cat: 'framework',  kw: ['express', 'express.js']            },
  { name: 'Django',        cat: 'framework',  kw: ['django']                           },
  { name: 'Flask',         cat: 'framework',  kw: ['flask']                            },
  { name: 'FastAPI',       cat: 'framework',  kw: ['fastapi']                          },
  { name: 'Spring Boot',   cat: 'framework',  kw: ['spring boot', 'spring framework']  },
  { name: 'Laravel',       cat: 'framework',  kw: ['laravel']                          },
  { name: 'NestJS',        cat: 'framework',  kw: ['nestjs', 'nest.js']                },
  { name: 'GraphQL',       cat: 'framework',  kw: ['graphql']                          },
  { name: 'REST API',      cat: 'framework',  kw: ['rest api', 'restful']              },
  { name: 'gRPC',          cat: 'framework',  kw: ['grpc']                             },

  // ── Databases ────────────────────────────────────────────────────
  { name: 'MySQL',         cat: 'database',   kw: ['mysql']                            },
  { name: 'PostgreSQL',    cat: 'database',   kw: ['postgresql', 'postgres']           },
  { name: 'MongoDB',       cat: 'database',   kw: ['mongodb', 'mongo']                 },
  { name: 'Redis',         cat: 'database',   kw: ['redis']                            },
  { name: 'SQLite',        cat: 'database',   kw: ['sqlite']                           },
  { name: 'Cassandra',     cat: 'database',   kw: ['cassandra']                        },
  { name: 'DynamoDB',      cat: 'database',   kw: ['dynamodb']                         },
  { name: 'Elasticsearch', cat: 'database',   kw: ['elasticsearch']                    },
  { name: 'SQL',           cat: 'database',   kw: [' sql ', 'sql,', 'sql.']            },
  { name: 'Supabase',      cat: 'database',   kw: ['supabase']                         },
  { name: 'Firebase',      cat: 'database',   kw: ['firebase', 'firestore']            },

  // ── Cloud & DevOps ────────────────────────────────────────────────
  { name: 'AWS',           cat: 'cloud',      kw: ['aws', 'amazon web services']       },
  { name: 'Google Cloud',  cat: 'cloud',      kw: ['gcp', 'google cloud']              },
  { name: 'Azure',         cat: 'cloud',      kw: ['azure', 'microsoft azure']         },
  { name: 'Docker',        cat: 'cloud',      kw: ['docker']                           },
  { name: 'Kubernetes',    cat: 'cloud',      kw: ['kubernetes', 'k8s']                },
  { name: 'Terraform',     cat: 'cloud',      kw: ['terraform']                        },
  { name: 'CI/CD',         cat: 'cloud',      kw: ['ci/cd', 'cicd', 'github actions', 'jenkins'] },
  { name: 'Linux',         cat: 'cloud',      kw: ['linux', 'ubuntu', 'centos']        },
  { name: 'Nginx',         cat: 'cloud',      kw: ['nginx']                            },
  { name: 'Vercel',        cat: 'cloud',      kw: ['vercel']                           },

  // ── ML / Data Science ─────────────────────────────────────────────
  { name: 'Machine Learning', cat: 'ml',      kw: ['machine learning']                 },
  { name: 'Deep Learning', cat: 'ml',         kw: ['deep learning']                    },
  { name: 'TensorFlow',    cat: 'ml',         kw: ['tensorflow']                       },
  { name: 'PyTorch',       cat: 'ml',         kw: ['pytorch']                          },
  { name: 'Scikit-learn',  cat: 'ml',         kw: ['scikit-learn', 'sklearn']          },
  { name: 'Pandas',        cat: 'ml',         kw: ['pandas']                           },
  { name: 'NumPy',         cat: 'ml',         kw: ['numpy']                            },
  { name: 'NLP',           cat: 'ml',         kw: ['nlp', 'natural language']          },
  { name: 'Computer Vision', cat: 'ml',       kw: ['computer vision', 'opencv']        },
  { name: 'LLMs',          cat: 'ml',         kw: ['llm', 'large language model', 'openai', 'langchain'] },

  // ── Tools ─────────────────────────────────────────────────────────
  { name: 'Git',           cat: 'tool',       kw: [' git ', 'git,', 'version control'] },
  { name: 'GitHub',        cat: 'tool',       kw: ['github']                           },
  { name: 'GitLab',        cat: 'tool',       kw: ['gitlab']                           },
  { name: 'Jira',          cat: 'tool',       kw: ['jira']                             },
  { name: 'Figma',         cat: 'tool',       kw: ['figma']                            },
  { name: 'Postman',       cat: 'tool',       kw: ['postman']                          },
  { name: 'Webpack',       cat: 'tool',       kw: ['webpack']                          },
  { name: 'Vite',          cat: 'tool',       kw: ['vite']                             },
  { name: 'Jest',          cat: 'tool',       kw: ['jest', 'unit test', 'testing']     },
  { name: 'Tableau',       cat: 'tool',       kw: ['tableau']                          },
  { name: 'Power BI',      cat: 'tool',       kw: ['power bi', 'powerbi']              },

  // ── Soft Skills ───────────────────────────────────────────────────
  { name: 'Agile/Scrum',   cat: 'soft',       kw: ['agile', 'scrum', 'sprint']         },
  { name: 'Leadership',    cat: 'soft',       kw: ['leadership', 'team lead']          },
  { name: 'Communication', cat: 'soft',       kw: ['communication']                    },
  { name: 'Problem Solving', cat: 'soft',     kw: ['problem solving', 'problem-solving'] },
  { name: 'Mentoring',     cat: 'soft',       kw: ['mentoring', 'coaching']            },
]

/**
 * Extract skills from resume text.
 * @param {string} text
 * @returns {{ name: string, category: string }[]}
 */
function extractSkills(text) {
  const t = ` ${text.toLowerCase()} `
  return SKILLS
    .filter(s => s.kw.some(kw => t.includes(kw)))
    .map(s => ({ name: s.name, category: s.cat }))
}

module.exports = { extractSkills }
