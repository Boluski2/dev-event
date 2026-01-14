import {NextRequest, NextResponse} from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'Invalid form data format'}, { status: 400 })
        }

        const file = formData.get('image') as File;

        if(!file) return NextResponse.json({ message: 'Image file is required'}, { status: 400 })

        // FIX: Handle both JSON and plain string formats
        let tags = [];
        let agenda = [];
        
        const tagsInput = formData.get('tags') as string;
        const agendaInput = formData.get('agenda') as string;

        // Parse tags
        if (tagsInput) {
            try {
                tags = JSON.parse(tagsInput);
            } catch {
                // If not JSON, treat as comma-separated string
                tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }
        
        // Parse agenda
        if (agendaInput) {
            try {
                agenda = JSON.parse(agendaInput);
            } catch {
                // If not JSON, treat as comma-separated string
                agenda = agendaInput.split(',').map(item => item.trim()).filter(item => item);
            }
        }

        // Validate arrays are not empty
        if (!Array.isArray(tags) || tags.length === 0) {
            return NextResponse.json({ message: 'At least one tag is required'}, { status: 400 });
        }
        
        if (!Array.isArray(agenda) || agenda.length === 0) {
            return NextResponse.json({ message: 'At least one agenda item is required'}, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if(error) return reject(error);
                resolve(results);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ 
            message: 'Event Creation Failed', 
            error: e instanceof Error ? e.message : 'Unknown'
        }, { status: 500 });
    }
}


export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        console.error('Error fetching events:', e);
        return NextResponse.json(
            { 
                message: 'Event fetching failed', 
                error: e instanceof Error ? e.message : 'Unknown error'
            }, 
            { status: 500 }
        );
    }
}