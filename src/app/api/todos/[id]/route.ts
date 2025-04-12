import { NextResponse } from 'next/server';
import connectToDatabase, { Todo } from '@/lib/db';
import mongoose from 'mongoose';

// Handler for updating a todo by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description || ''
      },
      { new: true }
    );
    
    if (!updatedTodo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 400 }
    );
  }
} 