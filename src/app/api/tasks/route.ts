import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Demo tasks for development (replace with database operations later)
let demoTasks = [
  {
    id: '1',
    userId: 'demo-user',
    title: 'Review 3 goals for the week',
    description: 'Go through quarterly goals and adjust weekly priorities',
    category: 'dream',
    completed: false,
    priority: 'high',
    timeEstimate: '15 min',
    createdAt: new Date().toISOString(),
    dueDate: null,
    streak: 0,
    tags: ['goals', 'planning']
  },
  {
    id: '2',
    userId: 'demo-user', 
    title: 'Take 5 deep breaths',
    description: 'Mindfulness breathing exercise',
    category: 'habit',
    completed: true,
    priority: 'medium',
    timeEstimate: '2 min',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    dueDate: null,
    streak: 7,
    tags: ['mindfulness', 'wellness']
  },
  {
    id: '3',
    userId: 'demo-user',
    title: 'Send one important email',
    description: 'Follow up on project proposal',
    category: 'daily',
    completed: false,
    priority: 'high',
    timeEstimate: '10 min',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    streak: 0,
    tags: ['communication', 'work']
  }
];

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Filter tasks for current user (in demo, return all)
    const userTasks = demoTasks.filter(task => task.userId === 'demo-user');

    return NextResponse.json({
      success: true,
      tasks: userTasks,
      count: userTasks.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch tasks',
        fallback: demoTasks
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, category, priority, timeEstimate, dueDate, tags } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create new task
    const newTask = {
      id: Date.now().toString(),
      userId: 'demo-user', // In production, use actual userId
      title: title.trim(),
      description: description || '',
      category: category || 'daily',
      completed: false,
      priority: priority || 'medium',
      timeEstimate: timeEstimate || '5 min',
      createdAt: new Date().toISOString(),
      dueDate: dueDate || null,
      streak: 0,
      tags: tags || []
    };

    // Add to demo tasks
    demoTasks.push(newTask);

    return NextResponse.json({
      success: true,
      task: newTask,
      message: 'Task created successfully'
    });

  } catch (error) {
    console.error('Create task error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Find and update task
    const taskIndex = demoTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Update task
    demoTasks[taskIndex] = {
      ...demoTasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Handle completion logic
    if (updates.completed === true && !demoTasks[taskIndex].completed) {
      demoTasks[taskIndex].completedAt = new Date().toISOString();
      
      // Increment streak for habits
      if (demoTasks[taskIndex].category === 'habit') {
        demoTasks[taskIndex].streak += 1;
      }
    }

    return NextResponse.json({
      success: true,
      task: demoTasks[taskIndex],
      message: 'Task updated successfully'
    });

  } catch (error) {
    console.error('Update task error:', error);
    
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Find and remove task
    const taskIndex = demoTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const deletedTask = demoTasks.splice(taskIndex, 1)[0];

    return NextResponse.json({
      success: true,
      task: deletedTask,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}