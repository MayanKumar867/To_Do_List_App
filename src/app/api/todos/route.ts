import { NextResponse } from 'next/server';
import connectToDatabase, { Todo } from '@/lib/db';

// GET handler for retrieving all todos
export async function GET() {
  try {
    await connectToDatabase();
    const todos = await Todo.find().sort({ date: -1 });
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new todo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();

    const todo = new Todo({
      title: body.title,
      description: body.description || '',
      date: new Date()
    });

    await todo.save();
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 400 }
    );
  }
} 