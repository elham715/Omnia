import React from 'react';
import { StudentResult, Question, Topic } from '../../types';
import { VideoPlayer } from '../VideoPlayer';
import { LaTeX } from '../LaTeX';
import { Award, AlertCircle, BookOpen } from 'lucide-react';

interface ResultsPageProps {
  result: StudentResult;
  questions: Question[];
  topics: Topic[];
}

export function ResultsPage({ result, questions, topics }: ResultsPageProps) {
  console.log('ResultsPage - result:', result);
  console.log('ResultsPage - questions:', questions);
  console.log('ResultsPage - topics:', topics);

  const percentage = Math.round((result.score / result.total_questions) * 100);
  
  const getIncorrectQuestions = (topic: string) => {
    const incorrectQs = questions.filter(q => 
      q.topic === topic && 
      result.answers[q.id] !== q.correct_answer
    );
    console.log(`Incorrect questions for topic ${topic}:`, incorrectQs);
    return incorrectQs;
  };

  const getTopicVideo = (topicName: string) => {
    return topics.find(t => t.name === topicName)?.explanation_video_url;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-0 sm:px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Award className={`w-10 h-10 ${
                percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Results</h1>
            <p className="text-gray-600 mb-4">
              {result.student_name} ({result.student_email})
            </p>
            
            <div className="flex items-center justify-center gap-8 text-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{result.score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">{result.total_questions - result.score}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Incorrect Topics Review */}
        {result.incorrect_topics.length > 0 && (
          <div className="space-y-8 mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Topics to Review ({result.incorrect_topics.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.incorrect_topics.map((topic) => (
                  <div key={topic} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium text-orange-800">{topic}</span>
                    </div>
                    <div className="text-sm text-orange-600 mt-1">
                      {getIncorrectQuestions(topic).length} questions to review
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Review by Topic */}
            {result.incorrect_topics.map((topicName) => {
              const incorrectQuestions = getIncorrectQuestions(topicName);
              const topicVideoUrl = getTopicVideo(topicName);
              
              return (
                <div key={topicName} className="mb-8">
                  {/* Topic Box (Blue Background) */}
                  <div className="bg-blue-100 rounded-lg shadow-md p-6 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex flex-col items-start md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Topic: {topicName}
                      </div>
                      {topicVideoUrl && (
                        <button
                          onClick={() => window.open(topicVideoUrl, '_blank')}
                          className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-200 rounded-full hover:bg-blue-300 flex items-center gap-1 w-full md:w-auto mt-2 md:mt-0"
                        >
                          <BookOpen className="w-4 h-4" />
                          📚 Complete Topic Explanation
                        </button>
                      )}
                    </h3>
                  </div>

                  {/* Individual Question Boxes (Reddish Background) */}
                  <div className="space-y-4">
                    {incorrectQuestions.map((question, index) => (
                      <div key={question.id} className="bg-red-50 rounded-lg shadow-md p-2">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Question {index + 1}: {question.question_text}
                        </h4>
                        
                        {question.question_latex && (
                          <div className="mb-3 p-3 bg-white rounded">
                            <LaTeX block>{question.question_latex}</LaTeX>
                          </div>
                        )}
                        
                        {question.image_url && (
                          <img 
                            src={question.image_url} 
                            alt="Question visual" 
                            className="mb-3 max-w-sm rounded border"
                          />
                        )}

                                                    <div className="space-y-2">
                                                      {question.options.map((option, optionIndex) => {
                                                        const isCorrectAnswer = optionIndex === question.correct_answer;
                                                        const isUserAnswer = optionIndex === result.answers[question.id];
                        
                                                        if (isCorrectAnswer || (isUserAnswer && !isCorrectAnswer)) {
                                                          return (
                                                            <div
                                                              key={optionIndex}
                                                              className={`p-2 rounded text-sm ${
                                                                isCorrectAnswer
                                                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                                                  : 'bg-red-100 text-red-800 border border-red-300'
                                                              }`}
                                                            >
                                                              {isCorrectAnswer && '✅ Correct: '}
                                                              {isUserAnswer && !isCorrectAnswer && '❌ Your answer: '}
                                                              {option}
                                                            </div>
                                                          );
                                                        }
                                                        return null;
                                                      })}
                                                    </div>
                        {question.explanation_latex && (
                          <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                            <h5 className="font-medium text-blue-900 mb-2">Explanation:</h5>
                            <LaTeX block>{question.explanation_latex}</LaTeX>
                          </div>
                        )}

                        {question.video_solution_url && (
                          <button
                            onClick={() => window.open(question.video_solution_url, '_blank')}
                            className="w-full bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 font-medium mt-4 flex items-center justify-center gap-2"
                          >
                            <BookOpen className="w-4 h-4" />
                            Watch Solution Video
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Perfect Score Message */}
        {result.incorrect_topics.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfect Score! 🎉</h2>
            <p className="text-gray-600 text-lg">
              Congratulations! You answered all questions correctly. Excellent work!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Take Another Exam
          </button>
        </div>
      </div>
    </div>
  );
}