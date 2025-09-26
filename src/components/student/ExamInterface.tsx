import React, { useState, useEffect } from 'react';
import { Exam, StudentResult } from '../../types';
import { Timer } from '../Timer';
import { LaTeX } from '../LaTeX';

interface ExamInterfaceProps {
  exam: Exam;
  studentName: string;
  studentEmail: string;
  onSubmit: (result: Omit<StudentResult, 'id' | 'completed_at'>) => void;
}

export function ExamInterface({ exam, studentName, studentEmail, onSubmit }: ExamInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = exam.questions[currentQuestionIndex];

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateResults = () => {
    let score = 0;
    const incorrectTopics = new Set<string>();

    exam.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correct_answer) {
        score++;
      } else {
        incorrectTopics.add(question.topic);
      }
    });

    return {
      score,
      incorrect_topics: Array.from(incorrectTopics)
    };
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    const { score, incorrect_topics } = calculateResults();
    
    setIsSubmitted(true);
    onSubmit({
      exam_id: exam.id,
      student_name: studentName,
      student_email: studentEmail,
      answers,
      score,
      total_questions: exam.questions.length,
      incorrect_topics
    });
  };

  const handleTimeUp = () => {
    if (!isSubmitted) {
      handleSubmit();
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-600">
                Student: {studentName} ({studentEmail})
              </p>
            </div>
            <Timer 
              duration={exam.time_limit_minutes} 
              onTimeUp={handleTimeUp}
              className="flex-shrink-0"
            />
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {answeredQuestions}/{exam.questions.length} answered</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Question Area */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {exam.questions.length}
                </span>
                <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  {currentQuestion.topic}
                </span>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-3">
                  {currentQuestion.question_text}
                </h2>
                
                {currentQuestion.question_latex && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <LaTeX block>{currentQuestion.question_latex}</LaTeX>
                  </div>
                )}
                
                {currentQuestion.image_url && (
                  <div className="mb-4">
                    <img 
                      src={currentQuestion.image_url} 
                      alt="Question visual" 
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      answers[currentQuestion.id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={index}
                      checked={answers[currentQuestion.id] === index}
                      onChange={() => handleAnswer(currentQuestion.id, index)}
                      className="w-5 h-5 text-blue-600 mr-3"
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex gap-3">
                  {currentQuestionIndex === exam.questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      Submit Exam
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
