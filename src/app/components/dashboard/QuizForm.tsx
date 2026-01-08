import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { createQuiz } from '../../services/api';

interface Question {
  questionText: string;
  questionType: 'multiple-choice' | 'true-false';
  options: { text: string; isCorrect: boolean }[];
  marks: number;
}

interface QuizFormProps {
  programId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function QuizForm({ programId, onSuccess, onCancel }: QuizFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '23:59',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '00:00',
    duration: 60,
    passingMarks: 0,
    questions: [] as Question[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    questionText: '',
    questionType: 'multiple-choice',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    marks: 1
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'passingMarks' ? Number(value) : value
    }));
  };

  const handleOptionChange = (index: number, text: string) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index].text = text;
    setCurrentQuestion(prev => ({ ...prev, options: updatedOptions }));
  };

  const handleCorrectAnswer = (index: number) => {
    const updatedOptions = currentQuestion.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }));
    setCurrentQuestion(prev => ({ ...prev, options: updatedOptions }));
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      setError('Please enter question text');
      return;
    }

    if (currentQuestion.options.some(opt => !opt.text.trim())) {
      setError('Please fill all options');
      return;
    }

    if (!currentQuestion.options.some(opt => opt.isCorrect)) {
      setError('Please mark the correct answer');
      return;
    }

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }));

    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple-choice',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      marks: 1
    });
    setError('');
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    setIsLoading(true);

    try {
      // Combine date and time
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString();
      const releasedDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString();
      const now = new Date();

      // Validate dates are not in the past
      if (new Date(releasedDateTime) < now) {
        setError('Release date and time cannot be in the past');
        setIsLoading(false);
        return;
      }

      if (new Date(dueDateTime) < now) {
        setError('Due date and time cannot be in the past');
        setIsLoading(false);
        return;
      }

      if (new Date(dueDateTime) <= new Date(releasedDateTime)) {
        setError('Due date must be after release date');
        setIsLoading(false);
        return;
      }
      
      const totalMarks = formData.questions.reduce((sum, q) => sum + q.marks, 0);
      await createQuiz({
        title: formData.title,
        description: formData.description,
        dueDate: dueDateTime,
        scheduledDate: releasedDateTime,
        duration: formData.duration,
        passingMarks: formData.passingMarks || totalMarks * 0.5,
        questions: formData.questions,
        program: programId
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const totalMarks = formData.questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="w-full max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Quiz</CardTitle>
          <CardDescription>Add quiz questions and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Biology Chapter 3 Quiz"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Quiz instructions and details"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Release Date *</Label>
                <Input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Release Time *</Label>
                <Input
                  id="scheduledTime"
                  name="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueTime">Due Time *</Label>
                <Input
                  id="dueTime"
                  name="dueTime"
                  type="time"
                  value={formData.dueTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingMarks">Passing Marks</Label>
                <Input
                  id="passingMarks"
                  name="passingMarks"
                  type="number"
                  min="0"
                  value={formData.passingMarks}
                  onChange={handleInputChange}
                  placeholder={`Default: ${Math.ceil(totalMarks * 0.5)}`}
                />
              </div>
            </div>

            {/* Questions Preview */}
            {formData.questions.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">
                  Added Questions ({formData.questions.length}) - Total Marks: {totalMarks}
                </h3>
                <div className="space-y-2">
                  {formData.questions.map((q, idx) => (
                    <div key={idx} className="flex items-start justify-between bg-white p-3 rounded border">
                      <div>
                        <p className="text-sm font-medium">Q{idx + 1}: {q.questionText}</p>
                        <p className="text-xs text-gray-600 mt-1">Marks: {q.marks}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.title || !formData.dueDate || formData.questions.length === 0}
                className="gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : null}
                Create Quiz
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Question Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Add Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="questionText">Question Text *</Label>
            <textarea
              id="questionText"
              placeholder="Enter your question"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
              value={currentQuestion.questionText}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, questionText: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="questionType">Question Type</Label>
              <select
                id="questionType"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={currentQuestion.questionType}
                onChange={(e) => setCurrentQuestion(prev => ({
                  ...prev,
                  questionType: e.target.value as 'multiple-choice' | 'true-false'
                }))}
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marks">Marks</Label>
              <Input
                id="marks"
                type="number"
                min="1"
                value={currentQuestion.marks}
                onChange={(e) => setCurrentQuestion(prev => ({
                  ...prev,
                  marks: Number(e.target.value)
                }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Options (Select the correct answer)</Label>
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct-answer"
                  checked={option.isCorrect}
                  onChange={() => handleCorrectAnswer(idx)}
                  className="w-4 h-4"
                />
                <Input
                  placeholder={`Option ${idx + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={addQuestion}
            className="w-full gap-2"
            variant="outline"
          >
            <Plus size={16} /> Add This Question
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
