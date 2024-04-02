// Note the user_id will be update to use uuid
export interface Event {
  event_id?: string;
  user_id: string; // this will change to uuid string uuid
  event_title?: string;
  event_description?: string;
  time_stamp?: Date;
  user_name?: string;
}

export interface EventLocation {
  user_id?: string;
  event_id?: string;
  latitude?: number;
  longitude?: number;
  time_stamp?: Date;
}

export interface JoinedEvent {
  join_id?: string;
  user_id?: string;
  event_id?: string;
  joined?: boolean;
  user_name?: string;
  // time_stamp?: Date;
}

export interface JoinCounter {
  user_id?: string; // created by
  event_id?: string;
  counter?: number;
}

export interface Events {
  event: Event;
  location: EventLocation;
}

// For event that user joined
export interface JoinedEvents extends Events {
  joinedEventList: JoinedEvent;
}
