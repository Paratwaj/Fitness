const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash the password
  const hashedPassword = await bcrypt.hash('password', 12);

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      role: 'admin',
    },
  });

  const trainer = await prisma.user.upsert({
    where: { email: 'trainer@example.com' },
    update: {},
    create: {
      name: 'Trainer User',
      email: 'trainer@example.com',
      password_hash: hashedPassword,
      role: 'trainer',
    },
  });

  const member = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      name: 'Member User',
      email: 'member@example.com',
      password_hash: hashedPassword,
      role: 'member',
    },
  });

  // Create plans
  const basicPlan = await prisma.plan.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Basic',
      description: 'Basic fitness plan',
      price: 29.99,
      duration_months: 1,
      features: ['Access to workout library', 'Basic nutrition guidelines'],
    },
  });

  const premiumPlan = await prisma.plan.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Premium',
      description: 'Premium fitness plan',
      price: 79.99,
      duration_months: 1,
      features: ['Personal trainer', 'Custom plans', 'Progress tracking'],
    },
  });

  const elitePlan = await prisma.plan.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Elite',
      description: 'Elite fitness plan',
      price: 149.99,
      duration_months: 1,
      features: ['Dedicated trainer', 'Daily check-ins', 'Advanced analytics'],
    },
  });

  // Create sample workouts
  const workout1 = await prisma.workout.create({
    data: {
      name: 'Beginner Full Body Workout',
      description: 'A complete beginner-friendly workout targeting all major muscle groups',
      exercises: [
        { name: 'Push-ups', sets: 3, reps: 10, rest: 60 },
        { name: 'Squats', sets: 3, reps: 15, rest: 60 },
        { name: 'Plank', sets: 3, duration: 30, rest: 60 },
        { name: 'Dumbbell Rows', sets: 3, reps: 12, rest: 60 }
      ],
      difficulty: 'beginner',
      duration_minutes: 45,
      created_by: trainer.id
    }
  });

  const workout2 = await prisma.workout.create({
    data: {
      name: 'Advanced Strength Training',
      description: 'High-intensity strength training for experienced athletes',
      exercises: [
        { name: 'Deadlifts', sets: 4, reps: 8, rest: 120 },
        { name: 'Bench Press', sets: 4, reps: 8, rest: 120 },
        { name: 'Pull-ups', sets: 4, reps: 10, rest: 90 },
        { name: 'Overhead Press', sets: 4, reps: 8, rest: 120 }
      ],
      difficulty: 'advanced',
      duration_minutes: 75,
      created_by: trainer.id
    }
  });

  // Create sample diets
  const diet1 = await prisma.diet.create({
    data: {
      name: 'High Protein Meal Plan',
      description: 'A balanced diet focused on high protein intake for muscle building',
      meals: [
        {
          name: 'Breakfast',
          items: ['4 egg whites', '1 cup oatmeal', '1 banana', '1 scoop protein powder'],
          calories: 450,
          protein: 35
        },
        {
          name: 'Lunch',
          items: ['6oz chicken breast', '1 cup brown rice', '2 cups broccoli', '1 tbsp olive oil'],
          calories: 550,
          protein: 45
        },
        {
          name: 'Dinner',
          items: ['6oz salmon', '1 large sweet potato', 'mixed vegetables', 'Greek yogurt'],
          calories: 500,
          protein: 40
        }
      ],
      calories: 2200,
      protein_grams: 120,
      carbs_grams: 180,
      fat_grams: 70,
      created_by: trainer.id
    }
  });

  const diet2 = await prisma.diet.create({
    data: {
      name: 'Weight Loss Program',
      description: 'Calorie-controlled diet for sustainable weight loss',
      meals: [
        {
          name: 'Breakfast',
          items: ['Greek yogurt', 'berries', 'chia seeds', 'honey'],
          calories: 300,
          protein: 20
        },
        {
          name: 'Lunch',
          items: ['Grilled chicken salad', 'quinoa', 'avocado', 'olive oil dressing'],
          calories: 400,
          protein: 30
        },
        {
          name: 'Dinner',
          items: ['Baked turkey', 'sweet potato', 'steamed vegetables', 'herbs'],
          calories: 350,
          protein: 35
        }
      ],
      calories: 1600,
      protein_grams: 85,
      carbs_grams: 120,
      fat_grams: 50,
      created_by: trainer.id
    }
  });

  console.log('Database seeded successfully with users, plans, workouts, and diets');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
