import React, { useState, useEffect } from 'react';
import { Question, StudentResult, Topic } from '../../types';
import { Users, FileText, TrendingUp, Calendar } from 'lucide-react';

interface AdminDashboardProps {
  results: StudentResult[];
  questions: Question[];
}

export function AdminDashboard({ results, questions }: AdminDashboardProps) {
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);

  const totalStudents = results.length;
  const averageScore = results.length > 0 
    ? results.reduce((sum, result) => sum + (result.score / result.total_questions) * 100, 0) / results.length
    : 0;

  const topicPerformance = React.useMemo(() => {
    const topics = [...new Set(questions.map(q => q.topic))];
    return topics.map(topic => {
      const topicQuestions = questions.filter(q => q.topic === topic);
      const topicResults = results.map(result => {
        const correct = topicQuestions.filter(q => 
          result.answers[q.id] === q.correct_answer
        ).length;
        return (correct / topicQuestions.length) * 100;
      });
      
      const avgPerformance = topicResults.length > 0
        ? topicResults.reduce((sum, score) => sum + score, 0) / topicResults.length
        : 0;
      
      return {
        topic,
        performance: Math.round(avgPerformance),
        questionsCount: topicQuestions.length,
        studentsCount: results.length
      };
    });
  }, [results, questions]);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(averageScore)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Topics</p>
              <p className="text-2xl font-bold text-gray-900">{topicPerformance.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Performance</h3>
        <div className="space-y-4">
          {topicPerformance.map((topic) => (
            <div key={topic.topic} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{topic.topic}</h4>
                <p className="text-sm text-gray-600">
                  {topic.questionsCount} questions • {topic.studentsCount} students
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      topic.performance >= 80 ? 'bg-green-500' : 
                      topic.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(topic.performance, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {topic.performance}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Exam Results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topics to Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => {
                const percentage = Math.round((result.score / result.total_questions) * 100);
                return (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {result.student_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {result.student_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {result.score}/{result.total_questions}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        percentage >= 80 ? 'bg-green-100 text-green-800' :
                        percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {result.incorrect_topics.length > 0 
                          ? result.incorrect_topics.join(', ')
                          : 'None - Perfect Score!'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(result.completed_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No exam results yet. Share your exam links with students to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}