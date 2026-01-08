import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { submitQuiz, getQuizSubmission } from '../../services/api';

interface Question {
  _id: string;
  questionText: string;
  options: { text: string; isCorrect?: boolean }[];
  marks: number;
}

interface QuizTakeProps {
  quiz: {
    _id: string;
    title: string;
    description: string;
    duration: number;
    totalMarks: number;
    questions: Question[];
    dueDate: string;
  };
  onQuizComplete: () => void;
}

export function QuizTake({ quiz, onQuizComplete }: QuizTakeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(quiz.duration * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isAnswered = answers[currentQuestion._id] !== undefined;

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion._id]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const submissionAnswers = quiz.questions.map(q => ({
        questionId: q._id,
        selectedOptionIndex: answers[q._id] ?? -1
      }));

      await submitQuiz(quiz._id, {
        answers: submissionAnswers,
        startedAt: new Date(Date.now() - (quiz.duration * 60 - timeRemaining) * 1000),
        duration: quiz.duration * 60 - timeRemaining
      });

      onQuizComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeWarning = timeRemaining < 300; // 5 minutes
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="w-full max-w-4xl space-y-4">
      {/* Header with time and progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{quiz.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className={`text-center p-3 rounded-lg ${isTimeWarning ? 'bg-red-100' : 'bg-blue-100'}`}>
              <p className="text-sm font-medium">Time Remaining</p>
              <p className={`text-2xl font-bold ${isTimeWarning ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeRemaining)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.questionText}</CardTitle>
          <CardDescription>
            Marks: {currentQuestion.marks} | Select one answer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <label
              key={idx}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                answers[currentQuestion._id] === idx
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="answer"
                checked={answers[currentQuestion._id] === idx}
                onChange={() => handleSelectAnswer(idx)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="ml-3 text-base">{option.text}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: {answeredCount} of {quiz.questions.length} answered</span>
              <span className="text-gray-600">{Math.round((answeredCount / quiz.questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation and Submit */}
      <div className="flex gap-3">
        <Button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          Previous
        </Button>

        {!isLastQuestion ? (
          <Button
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            className="flex-1"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => setShowSubmitConfirm(true)}
            className="flex-1 gap-2"
            disabled={isSubmitting || answeredCount === 0}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
            Submit Quiz
          </Button>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <AlertCircle className="text-orange-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold">Confirm Submission</p>
                  <p className="text-sm text-gray-700 mt-1">
                    You have answered {answeredCount} out of {quiz.questions.length} questions.
                    Once submitted, you cannot change your answers.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitConfirm(false)}
                >
                  Continue Quiz
                </Button>
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
                  Submit & Finish
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
