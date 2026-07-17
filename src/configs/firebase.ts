import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, updateDoc, doc, setDoc, writeBatch, deleteDoc, onSnapshot, limit, type Unsubscribe } from "firebase/firestore";
import { Timestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA5vygbj4RkWYTNPewDEtgQUnt6MrdMbrg",
  authDomain: "your-mental-buddy.firebaseapp.com",
  projectId: "your-mental-buddy",
  storageBucket: "your-mental-buddy.firebasestorage.app",
  messagingSenderId: "855424577320",
  appId: "1:855424577320:web:73ddabbb27c3d583486a1d",
  measurementId: "G-0ZSH78HNWK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Function to save a new journal entry to Firestore
const saveJournalEntry = async (entry: { mood: string; entryText: string; gratitude?: string }) => {
    try {
        const user = auth.currentUser;
        if (!user) {
           throw new Error("No user is currently logged in.");
        }
        const userId = user.uid;
        const docRef = await addDoc(collection(firestore, "journalEntries"), {
            ...entry, userId: userId,
            timestamp: Timestamp.now()
        });
        console.log("Document written with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false, error: e };
    }
};

// Function to retrieve journal entries for a specific user from Firestore
const getJournalEntries = async (userId: string) => {
    try {
        const q = query(
            collection(firestore, "journalEntries"),
            where("userId", "==", userId ),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
};

// Function to save a new assessment result to Firestore
const saveAssessmentResult = async (result: { type: string; score: number; level: string; recommendations: string[]; }) => {
  try {
    const user = auth.currentUser;
    if (!user) {
       throw new Error("No user is currently logged in.");
    }
    const userId = user.uid;
    const docRef = await addDoc(collection(firestore, "assessmentResults"), {
      ...result, userId: userId,
      timestamp: Timestamp.now()
    });
    console.log("Assessment result saved with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error saving assessment result: ", e);
    return { success: false, error: e }; 
  }
};

// Function to retrieve assessment results for a specific user from Firestore
const getAssessmentResults = async (userId: string) => {
  try {
    const q = query(
      collection(firestore, "assessmentResults"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error getting assessment results: ", e);
    return [];
  }
};

// Function to save user activity to Firestore
const saveUserActivity = async (activity: { userId: string; timestamp: string; activityType: string; activityName: string; pageName: string }) => {
  try {
    console.log("saveUserActivity called");
    console.log("Saving user activity:", activity)
    const docRef = await addDoc(collection(firestore, "userActivity"), {
      ...activity,
      timestamp: Timestamp.fromDate(new Date(activity.timestamp))
    });
    console.log("User activity saved with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error saving user activity: ", e);
    return { success: false, error: e };
  }
};


// Function to save a completed coping-tool session (breathing, grounding, games, affirmations) to Firestore
const saveToolSession = async (session: { toolType: string; details?: Record<string, unknown> }) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently logged in.");
    }
    const docRef = await addDoc(collection(firestore, "toolSessions"), {
      ...session,
      userId: user.uid,
      timestamp: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error saving tool session: ", e);
    return { success: false, error: e };
  }
};

// Function to retrieve past coping-tool sessions for a specific user, most recent first
const getToolSessions = async (userId: string, limitCount = 100) => {
  try {
    const q = query(
      collection(firestore, "toolSessions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limitCount).map((doc) => ({ id: doc.id, ...doc.data() })) as Array<{
      id: string;
      toolType: string;
      details?: Record<string, unknown>;
      timestamp: Timestamp;
    }>;
  } catch (e) {
    console.error("Error getting tool sessions: ", e);
    return [];
  }
};

// Deletes every document a user owns in a given collection (used for "Clear History" actions)
const deleteAllUserDocs = async (collectionName: string, userId: string) => {
  try {
    const q = query(collection(firestore, collectionName), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(firestore);
    querySnapshot.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
    return { success: true, count: querySnapshot.size };
  } catch (e) {
    console.error(`Error clearing ${collectionName}: `, e);
    return { success: false, error: e };
  }
};

const deleteAssessmentResults = (userId: string) => deleteAllUserDocs("assessmentResults", userId);
const deleteToolSessions = (userId: string) => deleteAllUserDocs("toolSessions", userId);
const deleteJournalEntries = (userId: string) => deleteAllUserDocs("journalEntries", userId);

// Deletes a single document from a given collection, for "select and delete" style UIs
const deleteSingleDoc = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(firestore, collectionName, docId));
    return { success: true };
  } catch (e) {
    console.error(`Error deleting ${collectionName} doc ${docId}: `, e);
    return { success: false, error: e };
  }
};

const deleteJournalEntry = (entryId: string) => deleteSingleDoc("journalEntries", entryId);
const deleteAssessmentResult = (entryId: string) => deleteSingleDoc("assessmentResults", entryId);

// Deletes every conversation document under a user's chat history subcollection
const deleteChatHistory = async (userId: string) => {
  try {
    const querySnapshot = await getDocs(collection(firestore, `users/${userId}/chatHistory`));
    const batch = writeBatch(firestore);
    querySnapshot.forEach((docSnap) => batch.delete(docSnap.ref));
    await batch.commit();
    return { success: true, count: querySnapshot.size };
  } catch (e) {
    console.error("Error clearing chat history: ", e);
    return { success: false, error: e };
  }
};

// Bookmarks a resource for a user (doc ID = resourceId, so toggling is idempotent)
const saveBookmark = async (userId: string, resourceId: string) => {
  try {
    await setDoc(doc(firestore, `users/${userId}/savedResources`, resourceId), {
      resourceId,
      timestamp: Timestamp.now(),
    });
    return { success: true };
  } catch (e) {
    console.error("Error saving bookmark: ", e);
    return { success: false, error: e };
  }
};

// Removes a resource bookmark for a user
const removeBookmark = async (userId: string, resourceId: string) => {
  try {
    await deleteDoc(doc(firestore, `users/${userId}/savedResources`, resourceId));
    return { success: true };
  } catch (e) {
    console.error("Error removing bookmark: ", e);
    return { success: false, error: e };
  }
};

// Retrieves the set of resource IDs a user has bookmarked
const getSavedResourceIds = async (userId: string): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, `users/${userId}/savedResources`));
    return querySnapshot.docs.map((docSnap) => docSnap.id);
  } catch (e) {
    console.error("Error getting saved resources: ", e);
    return [];
  }
};

// Function to save a custom reminder to Firestore
const saveReminder = async (reminder: { title: string; time: string; days: string[]; active: boolean; type: string }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently logged in.");
    const docRef = await addDoc(collection(firestore, "reminders"), {
      ...reminder,
      userId: user.uid,
      timestamp: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error saving reminder: ", e);
    return { success: false, error: e };
  }
};

// Function to retrieve a user's custom reminders from Firestore
const getReminders = async (userId: string) => {
  try {
    const q = query(
      collection(firestore, "reminders"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Array<{
      id: string;
      title: string;
      time: string;
      days: string[];
      active: boolean;
      type: string;
      timestamp: Timestamp;
    }>;
  } catch (e) {
    console.error("Error getting reminders: ", e);
    return [];
  }
};

// Function to update a reminder (e.g. toggle active) in Firestore
const updateReminder = async (reminderId: string, updates: Partial<{ title: string; time: string; days: string[]; active: boolean; type: string }>) => {
  try {
    await updateDoc(doc(firestore, "reminders", reminderId), updates);
    return { success: true };
  } catch (e) {
    console.error("Error updating reminder: ", e);
    return { success: false, error: e };
  }
};

// Function to delete a single reminder from Firestore
const deleteReminder = async (reminderId: string) => {
  try {
    await deleteDoc(doc(firestore, "reminders", reminderId));
    return { success: true };
  } catch (e) {
    console.error("Error deleting reminder: ", e);
    return { success: false, error: e };
  }
};

// Function to save a mood check-in to Firestore.
// By default each call creates its own timestamped record (used by the Journal, where
// checking in twice in a day are two genuinely different moods worth keeping separately).
// Pass upsertDaily: true for a deliberate once-a-day widget (the Home page Mood Tracker) —
// re-submitting the same day overwrites today's entry instead of piling up duplicates.
const saveMoodEntry = async (entry: { mood: number; note?: string }, options?: { upsertDaily?: boolean }) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently logged in.");
    }
    if (options?.upsertDaily) {
      const dayKey = new Date().toISOString().slice(0, 10);
      const docId = `${user.uid}_${dayKey}`;
      await setDoc(doc(firestore, "moodEntries", docId), {
        ...entry,
        userId: user.uid,
        timestamp: Timestamp.now(),
      });
      return { success: true, id: docId };
    }
    const docRef = await addDoc(collection(firestore, "moodEntries"), {
      ...entry,
      userId: user.uid,
      timestamp: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error saving mood entry: ", e);
    return { success: false, error: e };
  }
};

// Function to retrieve mood entries for a specific user, oldest first
const getMoodEntries = async (userId: string, limitCount = 30) => {
  try {
    const q = query(
      collection(firestore, "moodEntries"),
      where("userId", "==", userId),
      orderBy("timestamp", "asc")
    );
    const querySnapshot = await getDocs(q);
    const entries = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<{
      id: string;
      mood: number;
      note?: string;
      timestamp: Timestamp;
    }>;
    return entries.slice(-limitCount);
  } catch (e) {
    console.error("Error getting mood entries: ", e);
    return [];
  }
};

// Function to log a Gemini-classified emotion from a chat message
const saveEmotionLog = async (entry: { emotion: string; confidence: number }) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently logged in.");
    }
    const docRef = await addDoc(collection(firestore, "emotionLogs"), {
      ...entry,
      userId: user.uid,
      timestamp: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error saving emotion log: ", e);
    return { success: false, error: e };
  }
};

// Function to retrieve recent emotion logs for a specific user, most recent first
const getEmotionLogs = async (userId: string, limitCount = 30) => {
  try {
    const q = query(
      collection(firestore, "emotionLogs"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limitCount).map((doc) => ({ id: doc.id, ...doc.data() })) as Array<{
      id: string;
      emotion: string;
      confidence: number;
      timestamp: Timestamp;
    }>;
  } catch (e) {
    console.error("Error getting emotion logs: ", e);
    return [];
  }
};

// --- Community: chat rooms (real-time messages) ---

interface RoomMessage {
  id: string;
  userId: string;
  displayName: string;
  content: string;
  timestamp: Timestamp;
}

// Posts a message to a community chat room
const sendRoomMessage = async (roomId: string, displayName: string, content: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently logged in.");
    await addDoc(collection(firestore, `communityRooms/${roomId}/messages`), {
      userId: user.uid,
      displayName,
      content,
      timestamp: Timestamp.now(),
    });
    return { success: true };
  } catch (e) {
    console.error("Error sending room message: ", e);
    return { success: false, error: e };
  }
};

// Subscribes to real-time messages in a community chat room. Returns an unsubscribe function.
const subscribeToRoomMessages = (
  roomId: string,
  callback: (messages: RoomMessage[]) => void,
  messageLimit = 100
): Unsubscribe => {
  const q = query(
    collection(firestore, `communityRooms/${roomId}/messages`),
    orderBy("timestamp", "asc"),
    limit(messageLimit)
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as RoomMessage)));
  });
};

// Records that a user has joined a chat room (idempotent — doc ID is deterministic per user+room),
// so membership is a durable, visible state instead of only existing while a dialog is open
const joinChatRoom = async (userId: string, roomId: string, roomName: string) => {
  try {
    await setDoc(doc(firestore, "roomMemberships", `${userId}_${roomId}`), {
      userId,
      roomId,
      roomName,
      timestamp: Timestamp.now(),
    });
    return { success: true };
  } catch (e) {
    console.error("Error joining chat room: ", e);
    return { success: false, error: e };
  }
};

// Returns the room IDs a user has joined
const getUserChatRoomMemberships = async (userId: string): Promise<string[]> => {
  try {
    const q = query(collection(firestore, "roomMemberships"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => docSnap.data().roomId as string);
  } catch (e) {
    console.error("Error getting chat room memberships: ", e);
    return [];
  }
};

// --- Community: support groups ---

// Joins a support group (idempotent — doc ID is deterministic per user+group)
const joinSupportGroup = async (userId: string, groupId: string, groupName: string) => {
  try {
    await setDoc(doc(firestore, "groupMemberships", `${userId}_${groupId}`), {
      userId,
      groupId,
      groupName,
      timestamp: Timestamp.now(),
    });
    return { success: true };
  } catch (e) {
    console.error("Error joining group: ", e);
    return { success: false, error: e };
  }
};

const leaveSupportGroup = async (userId: string, groupId: string) => {
  try {
    await deleteDoc(doc(firestore, "groupMemberships", `${userId}_${groupId}`));
    return { success: true };
  } catch (e) {
    console.error("Error leaving group: ", e);
    return { success: false, error: e };
  }
};

// Returns the group IDs a user has joined
const getUserGroupMemberships = async (userId: string): Promise<string[]> => {
  try {
    const q = query(collection(firestore, "groupMemberships"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => docSnap.data().groupId as string);
  } catch (e) {
    console.error("Error getting group memberships: ", e);
    return [];
  }
};

// Returns real member counts for every group, keyed by groupId
const getGroupMemberCounts = async (): Promise<Record<string, number>> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "groupMemberships"));
    const counts: Record<string, number> = {};
    querySnapshot.forEach((docSnap) => {
      const groupId = docSnap.data().groupId as string;
      counts[groupId] = (counts[groupId] || 0) + 1;
    });
    return counts;
  } catch (e) {
    console.error("Error getting group member counts: ", e);
    return {};
  }
};

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  isPrivate: boolean;
  createdBy: string;
  timestamp: Timestamp;
}

// Creates a real, immediately-visible support group (not just a review request) and auto-joins the creator
const createCommunityGroup = async (group: { name: string; description: string; category: string; isPrivate: boolean }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently logged in.");
    const docRef = await addDoc(collection(firestore, "communityGroups"), {
      ...group,
      createdBy: user.uid,
      timestamp: Timestamp.now(),
    });
    await joinSupportGroup(user.uid, docRef.id, group.name);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error creating group: ", e);
    return { success: false, error: e };
  }
};

// Returns every user-created community group, newest first
const getCommunityGroups = async (): Promise<CommunityGroup[]> => {
  try {
    const q = query(collection(firestore, "communityGroups"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as CommunityGroup));
  } catch (e) {
    console.error("Error getting community groups: ", e);
    return [];
  }
};

// --- Community: event RSVPs ---

interface EventRsvp {
  userId: string;
  eventId: string;
  eventTitle: string;
  eventStart: Timestamp;
  timestamp: Timestamp;
  remindersEnabled?: boolean;
  lastReminderSentDate?: string;
}

const rsvpToEvent = async (userId: string, eventId: string, eventTitle: string, eventStart: Date, remindersEnabled = false) => {
  try {
    await setDoc(doc(firestore, "eventRsvps", `${userId}_${eventId}`), {
      userId,
      eventId,
      eventTitle,
      eventStart: Timestamp.fromDate(eventStart),
      timestamp: Timestamp.now(),
      remindersEnabled,
    });
    return { success: true };
  } catch (e) {
    console.error("Error saving RSVP: ", e);
    return { success: false, error: e };
  }
};

// Returns full RSVP docs for a user (used by the reminder checker, which needs eventStart/remindersEnabled)
const getUserEventRsvpDocs = async (userId: string): Promise<EventRsvp[]> => {
  try {
    const q = query(collection(firestore, "eventRsvps"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => docSnap.data() as EventRsvp);
  } catch (e) {
    console.error("Error getting event RSVP docs: ", e);
    return [];
  }
};

const markEventReminderSent = async (userId: string, eventId: string, dateKey: string) => {
  try {
    await updateDoc(doc(firestore, "eventRsvps", `${userId}_${eventId}`), { lastReminderSentDate: dateKey });
  } catch (e) {
    console.error("Error marking event reminder sent: ", e);
  }
};

const cancelEventRsvp = async (userId: string, eventId: string) => {
  try {
    await deleteDoc(doc(firestore, "eventRsvps", `${userId}_${eventId}`));
    return { success: true };
  } catch (e) {
    console.error("Error cancelling RSVP: ", e);
    return { success: false, error: e };
  }
};

const getUserEventRsvps = async (userId: string): Promise<string[]> => {
  try {
    const q = query(collection(firestore, "eventRsvps"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => docSnap.data().eventId as string);
  } catch (e) {
    console.error("Error getting event RSVPs: ", e);
    return [];
  }
};

// Returns real attendee counts for every event, keyed by eventId
const getEventAttendeeCounts = async (): Promise<Record<string, number>> => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "eventRsvps"));
    const counts: Record<string, number> = {};
    querySnapshot.forEach((docSnap) => {
      const eventId = docSnap.data().eventId as string;
      counts[eventId] = (counts[eventId] || 0) + 1;
    });
    return counts;
  } catch (e) {
    console.error("Error getting event attendee counts: ", e);
    return {};
  }
};

// --- Therapist appointments ---

interface Appointment {
  id: string;
  userId: string;
  therapistId: string;
  therapistName: string;
  type: "consultation" | "video";
  scheduledFor: Timestamp;
  status: "upcoming" | "cancelled";
  timestamp: Timestamp;
  remindersEnabled?: boolean;
  lastReminderSentDate?: string;
}

const bookAppointment = async (appointment: {
  therapistId: string;
  therapistName: string;
  type: "consultation" | "video";
  scheduledFor: Date;
  remindersEnabled?: boolean;
}) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently logged in.");
    const docRef = await addDoc(collection(firestore, "appointments"), {
      ...appointment,
      scheduledFor: Timestamp.fromDate(appointment.scheduledFor),
      userId: user.uid,
      status: "upcoming",
      timestamp: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error booking appointment: ", e);
    return { success: false, error: e };
  }
};

const markAppointmentReminderSent = async (appointmentId: string, dateKey: string) => {
  try {
    await updateDoc(doc(firestore, "appointments", appointmentId), { lastReminderSentDate: dateKey });
  } catch (e) {
    console.error("Error marking appointment reminder sent: ", e);
  }
};

const getUserAppointments = async (userId: string): Promise<Appointment[]> => {
  try {
    const q = query(collection(firestore, "appointments"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Appointment))
      .sort((a, b) => a.scheduledFor.toMillis() - b.scheduledFor.toMillis());
  } catch (e) {
    console.error("Error getting appointments: ", e);
    return [];
  }
};

const cancelAppointment = async (appointmentId: string) => {
  try {
    await updateDoc(doc(firestore, "appointments", appointmentId), { status: "cancelled" });
    return { success: true };
  } catch (e) {
    console.error("Error cancelling appointment: ", e);
    return { success: false, error: e };
  }
};

// --- Lifestyle risk predictor ---

interface RiskScore {
  score: number;
  level: string;
}

interface WellnessPrediction {
  id: string;
  userId: string;
  age: number;
  gender: string;
  region: string;
  sleepDuration: number;
  exerciseFrequency: number;
  socialMediaUsage: number;
  workHours: number;
  financialStress: string;
  relationshipIssues: string;
  supportSystem: number;
  selfCareActivities: number;
  stress: RiskScore;
  anxiety: RiskScore;
  depression: RiskScore;
  timestamp: Timestamp;
}

// Saves a lifestyle risk prediction (inputs + model output) as its own record, not just an activity log line
const saveWellnessPrediction = async (prediction: Omit<WellnessPrediction, "id" | "userId" | "timestamp">) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently logged in.");
    const docRef = await addDoc(collection(firestore, "wellnessPredictions"), {
      ...prediction,
      userId: user.uid,
      timestamp: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error saving wellness prediction: ", e);
    return { success: false, error: e };
  }
};

// Returns the user's most recent prediction, so the UI can restore it after a refresh
const getLatestWellnessPrediction = async (userId: string): Promise<WellnessPrediction | null> => {
  try {
    const q = query(
      collection(firestore, "wellnessPredictions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as WellnessPrediction;
  } catch (e) {
    console.error("Error getting latest wellness prediction: ", e);
    return null;
  }
};

// Returns all of a user's past predictions, most recent first
const getWellnessPredictions = async (userId: string): Promise<WellnessPrediction[]> => {
  try {
    const q = query(
      collection(firestore, "wellnessPredictions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as WellnessPrediction));
  } catch (e) {
    console.error("Error getting wellness predictions: ", e);
    return [];
  }
};

const deleteWellnessPredictions = (userId: string) => deleteAllUserDocs("wellnessPredictions", userId);

// Function to save a contact form submission to Firestore
const saveContactMessage = async (message: { name: string; email: string; subject: string; message: string }) => {
  try {
    const docRef = await addDoc(collection(firestore, "contactMessages"), {
      ...message,
      timestamp: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error saving contact message: ", e);
    return { success: false, error: e };
  }
};

// Function to update the user's therapist phone number in Firestore
const updateUserTherapistNumber = async (userId: string, newPhoneNumber: string) => {
  try {
    const userDocRef = doc(firestore, "users", userId); 
    await updateDoc(userDocRef, { therapistPhoneNumber: newPhoneNumber });
    console.log(`Therapist number updated for user: ${userId}`);
  } catch (e) {
    console.error(`Error updating therapist number for user: ${userId}`, e);
  }
};

export { app, auth, firestore, googleProvider, saveJournalEntry, getJournalEntries, saveAssessmentResult, getAssessmentResults, saveUserActivity, updateUserTherapistNumber, saveMoodEntry, getMoodEntries, saveEmotionLog, getEmotionLogs, saveContactMessage, saveToolSession, getToolSessions, deleteAssessmentResults, deleteToolSessions, deleteJournalEntries, deleteJournalEntry, deleteAssessmentResult, saveReminder, getReminders, updateReminder, deleteReminder, deleteChatHistory, saveBookmark, removeBookmark, getSavedResourceIds, sendRoomMessage, subscribeToRoomMessages, joinChatRoom, getUserChatRoomMemberships, joinSupportGroup, leaveSupportGroup, getUserGroupMemberships, getGroupMemberCounts, createCommunityGroup, getCommunityGroups, rsvpToEvent, cancelEventRsvp, getUserEventRsvps, getUserEventRsvpDocs, markEventReminderSent, getEventAttendeeCounts, bookAppointment, getUserAppointments, cancelAppointment, markAppointmentReminderSent, saveWellnessPrediction, getLatestWellnessPrediction, getWellnessPredictions, deleteWellnessPredictions };
