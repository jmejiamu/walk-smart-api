// Note the user_id will be update to use uuid 
export interface Event {
    event_id?: string;
    user_id: number; // this will change to uuid string uuid
    event_title?: string;
    event_description?: string;
    time_stamp?: Date;
}

export interface EventLocation {
    user_id?: number;
    event_id?: string;
    latitude?: string;
    longitude?: string;
    time_stamp?: Date;
}

export interface JoinedEvent {
    user_id?: number;
    event_id?: string;
    joined?: boolean;
    time_stamp?: Date;
}

// For all events
export interface Events {
    event: Event;
    location: EventLocation
}

// For event that user joined
export interface JoinedEvents extends Events {
    joinedEventList: JoinedEvent
}