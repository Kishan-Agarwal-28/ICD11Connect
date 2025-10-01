import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Star,
  Trophy,
  Flame,
  Heart,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Award,
  Target,
  Zap,
  Lock,
  Play,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: "basics" | "doshas" | "diagnosis" | "herbs" | "treatment";
  level: number;
  xp: number;
  questions: Question[];
  completed: boolean;
  unlocked: boolean;
}

interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "match";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  icdCode?: string;
  namasteCode?: string;
}

interface UserProgress {
  totalXP: number;
  level: number;
  streak: number;
  hearts: number;
  completedLessons: string[];
  achievements: string[];
}

const lessons: Lesson[] = [
  {
    id: "lesson-1",
    title: "Introduction to Ayurveda",
    description: "Learn the fundamental concepts of Ayurveda and its holistic approach",
    category: "basics",
    level: 1,
    xp: 10,
    unlocked: true,
    completed: false,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What does 'Ayurveda' literally mean?",
        options: ["Science of Life", "Ancient Medicine", "Herbal Healing", "Natural Treatment"],
        correctAnswer: 0,
        explanation: "Ayurveda comes from Sanskrit: 'Ayur' (life) + 'Veda' (science/knowledge)",
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "How many fundamental elements (Pancha Mahabhuta) form the basis of Ayurveda?",
        options: ["3", "5", "7", "9"],
        correctAnswer: 1,
        explanation:
          "The five elements are: Space (Akasha), Air (Vayu), Fire (Agni), Water (Jala), Earth (Prithvi)",
      },
      {
        id: "q3",
        type: "true-false",
        question: "Ayurveda treats only the symptoms of disease, not the root cause.",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation:
          "Ayurveda focuses on treating the root cause (Nidana) rather than just symptoms, promoting holistic healing.",
      },
    ],
  },
  {
    id: "lesson-2",
    title: "Understanding the Three Doshas",
    description: "Discover Vata, Pitta, and Kapha - the three energies that govern the body",
    category: "doshas",
    level: 2,
    xp: 15,
    unlocked: false,
    completed: false,
    questions: [
      {
        id: "q4",
        type: "multiple-choice",
        question: "Which dosha is composed of Space and Air elements?",
        options: ["Vata", "Pitta", "Kapha", "All three"],
        correctAnswer: 0,
        explanation: "Vata dosha is composed of Space (Akasha) and Air (Vayu) elements.",
        namasteCode: "AYU-VATA-001",
      },
      {
        id: "q5",
        type: "multiple-choice",
        question: "Which dosha governs digestion and metabolism?",
        options: ["Vata", "Pitta", "Kapha", "None"],
        correctAnswer: 1,
        explanation:
          "Pitta dosha, composed of Fire and Water, governs digestion, metabolism, and transformation.",
        namasteCode: "AYU-PITTA-001",
      },
      {
        id: "q6",
        type: "multiple-choice",
        question: "Kapha dosha provides what qualities to the body?",
        options: [
          "Movement and dryness",
          "Heat and transformation",
          "Structure and lubrication",
          "Lightness and cold",
        ],
        correctAnswer: 2,
        explanation:
          "Kapha (Earth + Water) provides structure, stability, lubrication, and cohesion to the body.",
        namasteCode: "AYU-KAPHA-001",
      },
    ],
  },
  {
    id: "lesson-3",
    title: "Digestive Disorders - Grahani Roga",
    description: "Learn about common digestive disorders in Ayurveda",
    category: "diagnosis",
    level: 3,
    xp: 20,
    unlocked: false,
    completed: false,
    questions: [
      {
        id: "q7",
        type: "multiple-choice",
        question: "Grahani refers to which organ system in Ayurveda?",
        options: ["Heart", "Liver", "Small intestine", "Stomach"],
        correctAnswer: 2,
        explanation:
          "Grahani refers to the small intestine and digestive system. Grahani Roga encompasses IBS-like conditions.",
        namasteCode: "AYU-DIG-001",
        icdCode: "DA90",
      },
      {
        id: "q8",
        type: "multiple-choice",
        question: "What is the primary cause (Nidana) of Grahani Roga?",
        options: [
          "Bacteria",
          "Weak digestive fire (Mandagni)",
          "Virus",
          "Genetic factors only",
        ],
        correctAnswer: 1,
        explanation:
          "Mandagni (weak digestive fire/Agni) is considered the primary cause of Grahani Roga in Ayurveda.",
      },
      {
        id: "q9",
        type: "true-false",
        question: "Grahani Roga can map to ICD-11 functional gastrointestinal disorders.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation:
          "Yes! Grahani Roga correlates with ICD-11 codes like DA90 (Functional gastrointestinal disorders) in dual-coding.",
        icdCode: "DA90",
      },
    ],
  },
  {
    id: "lesson-4",
    title: "Ayurvedic Herbs - Basics",
    description: "Introduction to common Ayurvedic herbs and their properties",
    category: "herbs",
    level: 4,
    xp: 20,
    unlocked: false,
    completed: false,
    questions: [
      {
        id: "q10",
        type: "multiple-choice",
        question: "Triphala is a combination of how many fruits?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 2,
        explanation:
          "Triphala means 'three fruits': Amalaki, Bibhitaki, and Haritaki. It's used for digestive health.",
      },
      {
        id: "q11",
        type: "multiple-choice",
        question: "Which herb is known as 'Indian Ginseng' and is an adaptogen?",
        options: ["Tulsi", "Ashwagandha", "Neem", "Turmeric"],
        correctAnswer: 1,
        explanation:
          "Ashwagandha (Withania somnifera) is called Indian Ginseng and helps the body adapt to stress.",
      },
      {
        id: "q12",
        type: "multiple-choice",
        question: "Turmeric (Haridra) is primarily used for which property?",
        options: [
          "Sleep aid",
          "Anti-inflammatory",
          "Blood thinner",
          "Appetite suppressant",
        ],
        correctAnswer: 1,
        explanation:
          "Turmeric's active compound curcumin has powerful anti-inflammatory and antioxidant properties.",
      },
    ],
  },
  {
    id: "lesson-5",
    title: "Treatment Principles - Chikitsa",
    description: "Learn the fundamental treatment approaches in Ayurveda",
    category: "treatment",
    level: 5,
    xp: 25,
    unlocked: false,
    completed: false,
    questions: [
      {
        id: "q13",
        type: "multiple-choice",
        question: "What is Panchakarma?",
        options: [
          "Five herbal formulas",
          "Five detoxification procedures",
          "Five diagnostic methods",
          "Five yoga poses",
        ],
        correctAnswer: 1,
        explanation:
          "Panchakarma means 'five actions' - therapeutic detoxification procedures: Vamana, Virechana, Basti, Nasya, Raktamokshana.",
      },
      {
        id: "q14",
        type: "true-false",
        question: "Ayurvedic treatment focuses on balancing doshas rather than killing pathogens.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation:
          "True! Ayurveda emphasizes restoring doshic balance, enhancing immunity, and supporting the body's natural healing.",
      },
      {
        id: "q15",
        type: "multiple-choice",
        question: "Shamana therapy refers to:",
        options: [
          "Surgery",
          "Palliative treatment",
          "Emergency care",
          "Preventive medicine",
        ],
        correctAnswer: 1,
        explanation:
          "Shamana is palliative/pacification therapy using diet, herbs, and lifestyle to balance doshas without elimination.",
      },
    ],
  },
];

const achievements = [
  { id: "first-lesson", name: "First Steps", icon: "🎓", description: "Complete your first lesson" },
  { id: "3-day-streak", name: "Consistent Learner", icon: "🔥", description: "Maintain a 3-day streak" },
  { id: "dosha-master", name: "Dosha Master", icon: "⚖️", description: "Complete all dosha lessons" },
  { id: "level-5", name: "Ayurveda Scholar", icon: "📚", description: "Reach level 5" },
  { id: "perfect-score", name: "Perfectionist", icon: "💯", description: "Get 100% on any lesson" },
];

export default function AyurvedaLearning() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXP: 0,
    level: 1,
    streak: 0,
    hearts: 5,
    completedLessons: [],
    achievements: [],
  });

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [score, setScore] = useState(0);

  // Update lesson unlock status based on progress
  useEffect(() => {
    lessons.forEach((lesson, index) => {
      if (index === 0) {
        lesson.unlocked = true;
      } else {
        lesson.unlocked = userProgress.completedLessons.includes(lessons[index - 1].id);
      }
      lesson.completed = userProgress.completedLessons.includes(lesson.id);
    });
  }, [userProgress.completedLessons]);

  const startLesson = (lesson: Lesson) => {
    if (!lesson.unlocked) return;
    setCurrentLesson(lesson);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setLessonComplete(false);
    setScore(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null || !currentLesson) return;

    const currentQuestion = currentLesson.questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
    } else {
      // Lose a heart for wrong answer
      if (userProgress.hearts > 0) {
        setUserProgress({
          ...userProgress,
          hearts: userProgress.hearts - 1,
        });
      }
    }
  };

  const nextQuestion = () => {
    if (!currentLesson) return;

    if (currentQuestionIndex < currentLesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      completeLesson();
    }
  };

  const completeLesson = () => {
    if (!currentLesson) return;

    const isPerfect = score === currentLesson.questions.length;
    const newXP = userProgress.totalXP + currentLesson.xp;
    const newLevel = Math.floor(newXP / 50) + 1;

    const newAchievements = [...userProgress.achievements];
    if (userProgress.completedLessons.length === 0) {
      newAchievements.push("first-lesson");
    }
    if (isPerfect && !newAchievements.includes("perfect-score")) {
      newAchievements.push("perfect-score");
    }
    if (newLevel >= 5 && !newAchievements.includes("level-5")) {
      newAchievements.push("level-5");
    }

    setUserProgress({
      ...userProgress,
      totalXP: newXP,
      level: newLevel,
      completedLessons: [...userProgress.completedLessons, currentLesson.id],
      achievements: newAchievements,
    });

    setLessonComplete(true);
  };

  const exitLesson = () => {
    setCurrentLesson(null);
    setLessonComplete(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basics":
        return <BookOpen className="w-5 h-5" />;
      case "doshas":
        return <Target className="w-5 h-5" />;
      case "diagnosis":
        return <Zap className="w-5 h-5" />;
      case "herbs":
        return <Award className="w-5 h-5" />;
      case "treatment":
        return <Trophy className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basics":
        return "bg-blue-100 text-blue-700";
      case "doshas":
        return "bg-purple-100 text-purple-700";
      case "diagnosis":
        return "bg-green-100 text-green-700";
      case "herbs":
        return "bg-amber-100 text-amber-700";
      case "treatment":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Lesson Selection View
  if (!currentLesson) {
    return (
      <div className="space-y-6">
        {/* Stats Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userProgress.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userProgress.totalXP}</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userProgress.level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userProgress.hearts}/5</div>
                  <div className="text-sm text-muted-foreground">Hearts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        {userProgress.achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {achievements
                  .filter((a) => userProgress.achievements.includes(a.id))
                  .map((achievement) => (
                    <Badge key={achievement.id} variant="secondary" className="text-lg py-2 px-3">
                      {achievement.icon} {achievement.name}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lessons */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Path</CardTitle>
            <CardDescription>Master Ayurveda one lesson at a time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className={`${
                    !lesson.unlocked ? "opacity-50" : "hover:shadow-lg transition-shadow cursor-pointer"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-16 h-16 rounded-lg flex items-center justify-center ${getCategoryColor(
                            lesson.category
                          )}`}
                        >
                          {lesson.unlocked ? (
                            getCategoryIcon(lesson.category)
                          ) : (
                            <Lock className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{lesson.title}</h3>
                            {lesson.completed && (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <Badge variant="outline">Level {lesson.level}</Badge>
                            <span className="text-amber-600 flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              {lesson.xp} XP
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => startLesson(lesson)}
                        disabled={!lesson.unlocked}
                        size="lg"
                      >
                        {lesson.completed ? (
                          "Practice Again"
                        ) : lesson.unlocked ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </>
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Lesson Complete View
  if (lessonComplete) {
    const percentage = Math.round((score / currentLesson.questions.length) * 100);
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl">Lesson Complete!</CardTitle>
          <CardDescription>You earned {currentLesson.xp} XP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">{percentage}%</div>
            <p className="text-muted-foreground">
              {score} out of {currentLesson.questions.length} correct
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>
                {userProgress.totalXP % 50} / 50 XP
              </span>
            </div>
            <Progress value={(userProgress.totalXP % 50) * 2} />
          </div>

          {percentage === 100 && (
            <Alert className="bg-amber-50 border-amber-200">
              <Trophy className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Perfect score! You've mastered this lesson! 🎉
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button onClick={exitLesson} variant="outline" className="flex-1">
              Back to Lessons
            </Button>
            <Button
              onClick={() => {
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setShowFeedback(false);
                setLessonComplete(false);
                setScore(0);
              }}
              className="flex-1"
            >
              Practice Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz View
  const currentQuestion = currentLesson.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentLesson.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {Array.from({ length: userProgress.hearts }).map((_, i) => (
              <Heart key={i} className="w-5 h-5 text-red-500 fill-red-500" />
            ))}
            {Array.from({ length: 5 - userProgress.hearts }).map((_, i) => (
              <Heart key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} / {currentLesson.questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          {(currentQuestion.namasteCode || currentQuestion.icdCode) && (
            <div className="flex gap-2 mt-2">
              {currentQuestion.namasteCode && (
                <Badge variant="secondary" className="text-xs">
                  NAMASTE: {currentQuestion.namasteCode}
                </Badge>
              )}
              {currentQuestion.icdCode && (
                <Badge variant="outline" className="text-xs">
                  ICD-11: {currentQuestion.icdCode}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={selectedAnswer?.toString()} onValueChange={(val) => handleAnswerSelect(parseInt(val))}>
            {currentQuestion.options?.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedAnswer === index
                    ? showFeedback
                      ? isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                } ${showFeedback && index === currentQuestion.correctAnswer ? "border-green-500 bg-green-50" : ""}`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={showFeedback} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
                {showFeedback && index === currentQuestion.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {showFeedback && selectedAnswer === index && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            ))}
          </RadioGroup>

          {showFeedback && (
            <Alert className={isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <AlertDescription className={isCorrect ? "text-green-800" : "text-red-800"}>
                {isCorrect ? "Correct! " : "Not quite. "}
                {currentQuestion.explanation}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={exitLesson} variant="outline" className="flex-1">
              Exit
            </Button>
            {!showFeedback ? (
              <Button onClick={checkAnswer} disabled={selectedAnswer === null} className="flex-1">
                Check Answer
              </Button>
            ) : (
              <Button onClick={nextQuestion} className="flex-1">
                {currentQuestionIndex < currentLesson.questions.length - 1 ? (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  "Complete Lesson"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
