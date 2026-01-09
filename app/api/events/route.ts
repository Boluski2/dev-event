// import {NextRequest, NextResponse} from "next/server";
// import { v2 as cloudinary } from 'cloudinary';

// import connectDB from "@/lib/mongodb";
// import Event from '@/database/event.model';

// export async function POST(req: NextRequest) {
//     try {
//         await connectDB();

//         const formData = await req.formData();

//         let event;

//         try {
//             event = Object.fromEntries(formData.entries());
//         } catch (e) {
//             return NextResponse.json({ message: 'Invalid JSON data format'}, { status: 400 })
//         }

//         const file = formData.get('image') as File;

//         if(!file) return NextResponse.json({ message: 'Image file is required'}, { status: 400 })

//         let tags = JSON.parse(formData.get('tags') as string);
//         let agenda = JSON.parse(formData.get('agenda') as string);

//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);

//         const uploadResult = await new Promise((resolve, reject) => {
//             cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
//                 if(error) return reject(error);

//                 resolve(results);
//             }).end(buffer);
//         });

//         event.image = (uploadResult as { secure_url: string }).secure_url;

//         const createdEvent = await Event.create({
//             ...event,
//             tags: tags,
//             agenda: agenda,
//         });

//         return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
//     } catch (e) {
//         console.error(e);
//         return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown'}, { status: 500 })
//     }
// }

// export async function GET() {
//     try {
//         await connectDB();

//         const events = await Event.find().sort({ createdAt: -1 });

//         return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
//     } catch (e) {
//         return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
//     }
// }


// import {NextRequest, NextResponse} from "next/server";
// import { v2 as cloudinary } from 'cloudinary';

// import connectDB from "@/lib/mongodb";
// import Event from '@/database/event.model';

// export async function POST(req: NextRequest) {
//     try {
//         await connectDB();

//         const formData = await req.formData();
        
//         // Get all form data fields
//         const title = formData.get('title') as string;
//         const description = formData.get('description') as string;
//         const overview = formData.get('overview') as string;
//         const venue = formData.get('venue') as string;
//         const location = formData.get('location') as string;
//         const date = formData.get('date') as string;
//         const time = formData.get('time') as string;
//         const mode = formData.get('mode') as string;
//         const audience = formData.get('audience') as string;
//         const organizer = formData.get('organizer') as string;
//         const file = formData.get('image') as File;

//         // Validate required fields
//         const requiredFields = {
//             title, description, overview, venue, location, 
//             date, time, mode, audience, organizer
//         };

//         for (const [field, value] of Object.entries(requiredFields)) {
//             if (!value || value.toString().trim() === '') {
//                 return NextResponse.json(
//                     { message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` }, 
//                     { status: 400 }
//                 );
//             }
//         }

//         if (!file) {
//             return NextResponse.json({ message: 'Image file is required'}, { status: 400 });
//         }

//         // Parse tags and agenda with proper error handling
//         let tags: string[] = [];
//         let agenda: string[] = [];
        
//         const tagsInput = formData.get('tags');
//         const agendaInput = formData.get('agenda');

//         try {
//             if (tagsInput) {
//                 tags = typeof tagsInput === 'string' ? JSON.parse(tagsInput) : [];
//             }
//         } catch (e) {
//             // If parsing fails, try to handle as comma-separated string
//             if (typeof tagsInput === 'string') {
//                 tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
//             }
//         }

//         try {
//             if (agendaInput) {
//                 agenda = typeof agendaInput === 'string' ? JSON.parse(agendaInput) : [];
//             }
//         } catch (e) {
//             // If parsing fails, handle as single string or comma-separated
//             if (typeof agendaInput === 'string') {
//                 if (agendaInput.includes('[') && agendaInput.includes(']')) {
//                     // Try to clean and parse as JSON array format
//                     const cleaned = agendaInput.replace(/[\[\]"]/g, '');
//                     agenda = cleaned.split(',').map(item => item.trim()).filter(item => item.length > 0);
//                 } else {
//                     agenda = [agendaInput];
//                 }
//             }
//         }

//         // Validate arrays are not empty
//         if (!Array.isArray(tags) || tags.length === 0) {
//             return NextResponse.json({ message: 'At least one tag is required' }, { status: 400 });
//         }

//         if (!Array.isArray(agenda) || agenda.length === 0) {
//             return NextResponse.json({ message: 'At least one agenda item is required' }, { status: 400 });
//         }

//         // Upload image to Cloudinary
//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);

//         const uploadResult = await new Promise((resolve, reject) => {
//             cloudinary.uploader.upload_stream(
//                 { resource_type: 'image', folder: 'DevEvent' }, 
//                 (error, results) => {
//                     if (error) return reject(error);
//                     resolve(results);
//                 }
//             ).end(buffer);
//         });

//         const imageUrl = (uploadResult as { secure_url: string }).secure_url;

//         // Create event object
//         const eventData = {
//             title: title.trim(),
//             description: description.trim(),
//             overview: overview.trim(),
//             venue: venue.trim(),
//             location: location.trim(),
//             date: date.trim(),
//             time: time.trim(),
//             mode: mode.trim(),
//             audience: audience.trim(),
//             organizer: organizer.trim(),
//             image: imageUrl,
//             tags: tags,
//             agenda: agenda,
//         };

//         const createdEvent = await Event.create(eventData);

//         return NextResponse.json(
//             { message: 'Event created successfully', event: createdEvent }, 
//             { status: 201 }
//         );
//     } catch (e) {
//         console.error('Error creating event:', e);
//         return NextResponse.json(
//             { 
//                 message: 'Event Creation Failed', 
//                 error: e instanceof Error ? e.message : 'Unknown error'
//             }, 
//             { status: 500 }
//         );
//     }
// }

// export async function GET() {
//     try {
//         await connectDB();

//         const events = await Event.find().sort({ createdAt: -1 });

//         return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
//     } catch (e) {
//         console.error('Error fetching events:', e);
//         return NextResponse.json(
//             { 
//                 message: 'Event fetching failed', 
//                 error: e instanceof Error ? e.message : 'Unknown error'
//             }, 
//             { status: 500 }
//         );
//     }
// }



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