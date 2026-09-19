import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  UserRole, 
  Mechanic, 
  ServiceRequest, 
  RequestStatus, 
  VehicleType, 
  ServiceSpecialty, 
  UrgencyLevel,
  BookingNotification,
  PaymentMethod,
  PaymentStatus
} from '../types';
import { 
  INITIAL_USER_DRIVER, 
  INITIAL_USER_MECHANIC, 
  INITIAL_USER_ADMIN, 
  INITIAL_MECHANICS, 
  SAMPLE_SERVICE_REQUESTS 
} from '../utils/mockData';
import { soundFx } from '../utils/audioAlert';
import { generateOTP } from '../utils/utils';
import { toast } from 'sonner';
import { mechanicService, requestService, authService } from '../services';

interface CreateRequestParams {
  vehicleType: VehicleType;
  vehicleModel: string;
  vehicleNumber: string;
  issueType: ServiceSpecialty;
  urgency: UrgencyLevel;
  description: string;
  locationName: string;
  lat?: number;
  lng?: number;
  landmark?: string;
  preferredMechanicId?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentRefId?: string;
  upiId?: string;
}

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  mechanics: Mechanic[];
  serviceRequests: ServiceRequest[];
  activeRequest: ServiceRequest | null;
  userCoords: { lat: number; lng: number; address: string };
  isLocating: boolean;
  createRequest: (params: CreateRequestParams) => ServiceRequest;
  cancelRequest: (requestId: string) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  updatePaymentStatus: (requestId: string, method: PaymentMethod, status: PaymentStatus, refId?: string) => void;
  toggleMechanicOnline: (mechanicId: string) => void;
  verifyMechanic: (mechanicId: string, verified: boolean) => void;
  registerMechanic: (data: Omit<Mechanic, 'id' | 'rating' | 'reviewsCount' | 'distanceKm' | 'etaMinutes' | 'isVerified'>) => void;
  updateUserProfile: (data: Partial<User>) => void;
  fetchLiveLocation: () => void;
  notifications: BookingNotification[];
  unreadNotificationCount: number;
  addBookingNotification: (data: Omit<BookingNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  isAuthenticated: boolean;
  loginUser: (emailOrPhone: string, role?: UserRole) => boolean;
  registerUser: (userData: { name: string; phone: string; email?: string; role: UserRole; vehicleModel?: string; vehicleNumber?: string }) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Role & User
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('md_role');
    return (saved as UserRole) || 'driver';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('md_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_USER_DRIVER;
  });

  // Mechanics
  const [mechanics, setMechanics] = useState<Mechanic[]>(() => {
    const saved = localStorage.getItem('md_mechanics');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_MECHANICS;
  });

  // Service Requests
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('md_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return SAMPLE_SERVICE_REQUESTS;
  });

  // Geolocation (Default to Moradabad TMU highway area)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; address: string }>({
    lat: 28.8386,
    lng: 78.7733,
    address: 'NH-24 Delhi Road, Near TMU Campus, Moradabad, Uttar Pradesh'
  });
  const [isLocating, setIsLocating] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('md_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('md_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('md_mechanics', JSON.stringify(mechanics));
  }, [mechanics]);

  useEffect(() => {
    localStorage.setItem('md_requests', JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  // Notifications
  const [notifications, setNotifications] = useState<BookingNotification[]>(() => {
    const saved = localStorage.getItem('md_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'NOTIF-1',
        type: 'emergency_breakdown',
        title: 'Dead Battery Jumpstart Booking',
        customerName: 'Rahul Verma',
        customerPhone: '+91 98765 43210',
        vehicleOrPlan: 'Maruti Swift (UP 21 AX 1024)',
        locationOrGarage: 'Near TMU Campus Gate 2, Delhi Road, Moradabad',
        estimatedCost: 399,
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        isRead: false
      }
    ];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('md_auth') === 'true';
  });

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    localStorage.setItem('md_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Try fetching live browser GPS location
  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.info('Using default Moradabad highway coordinates');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: `GPS Pin: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E (Highway Corridor)`
        });
        setIsLocating(false);
        toast.success('Live GPS coordinates acquired!');
      },
      () => {
        setIsLocating(false);
        toast.info('GPS permission not granted; using Moradabad Highway location.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    fetchLiveLocation();
  }, []);

  // Switch role helper
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'driver') {
      setCurrentUser(INITIAL_USER_DRIVER);
      toast.success('Switched to Driver / Vehicle Owner Mode');
    } else if (role === 'mechanic') {
      setCurrentUser(INITIAL_USER_MECHANIC);
      toast.success('Switched to Mechanic Partner Portal');
    } else {
      setCurrentUser(INITIAL_USER_ADMIN);
      toast.success('Switched to Admin Management Panel');
    }
  };

  // Find active request for current user if driver
  const activeRequest = serviceRequests.find(
    r => (r.userId === currentUser.id || currentRole === 'admin' || currentRole === 'mechanic') && 
    ['pending', 'accepted', 'en_route', 'arrived', 'in_progress'].includes(r.status)
  ) || null;

  // Create Service Request
  const createRequest = (params: CreateRequestParams): ServiceRequest => {
    // Pick mechanic: specified or nearest available
    let assignedMechanic = mechanics.find(m => m.id === params.preferredMechanicId && m.isAvailable);
    if (!assignedMechanic) {
      assignedMechanic = mechanics.find(m => m.isAvailable && m.services.includes(params.issueType)) || mechanics[0];
    }

    const newReq: ServiceRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name || 'Vehicle Owner',
      userPhone: currentUser.phone || '+91 98199 12166',
      vehicleType: params.vehicleType,
      vehicleModel: params.vehicleModel || 'Car / Bike',
      vehicleNumber: params.vehicleNumber || 'Unregistered',
      issueType: params.issueType,
      urgency: params.urgency,
      description: params.description,
      locationName: params.locationName || userCoords.address,
      lat: params.lat || userCoords.lat,
      lng: params.lng || userCoords.lng,
      landmark: params.landmark,
      status: 'pending',
      mechanicId: assignedMechanic?.id,
      mechanic: assignedMechanic,
      estimatedCost: assignedMechanic ? assignedMechanic.baseCharge + 150 : 499,
      otp: generateOTP(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      etaMinutes: assignedMechanic ? assignedMechanic.etaMinutes : 20,
      paymentMethod: params.paymentMethod || 'cash',
      paymentStatus: params.paymentStatus || (params.paymentMethod === 'cash' ? 'pay_on_delivery' : 'pending'),
      paymentRefId: params.paymentRefId,
      upiId: params.upiId
    };

    setServiceRequests(prev => [newReq, ...prev]);

    // Sound effect based on urgency
    if (params.urgency === 'sos') {
      soundFx.playSOSSiren();
    } else {
      soundFx.playDispatchChime();
    }

    // Trigger notification to platform owner & notification center
    addBookingNotification({
      type: 'emergency_breakdown',
      title: `Breakdown: ${params.issueType.toUpperCase()}`,
      customerName: newReq.userName,
      customerPhone: newReq.userPhone,
      vehicleOrPlan: `${params.vehicleModel} (${params.vehicleNumber})`,
      locationOrGarage: newReq.locationName,
      estimatedCost: newReq.estimatedCost,
      paymentMethod: newReq.paymentMethod,
      paymentStatus: newReq.paymentStatus
    });

    toast.success(`Breakdown dispatch sent! Mechanic ${assignedMechanic?.name || 'Partner'} alerted.`);
    return newReq;
  };

  // Update Payment Status
  const updatePaymentStatus = (requestId: string, method: PaymentMethod, status: PaymentStatus, refId?: string) => {
    setServiceRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            paymentMethod: method,
            paymentStatus: status,
            paymentRefId: refId || r.paymentRefId,
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    if (status === 'paid') {
      soundFx.playSuccessTone();
      toast.success(`Payment updated: ${method.startsWith('upi') ? 'Paid via UPI' : 'Cash on Delivery'}`);
    }
  };

  // Cancel Request
  const cancelRequest = (requestId: string) => {
    setServiceRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: 'cancelled', updatedAt: new Date().toISOString() } : r)
    );
    toast.error('Emergency request cancelled.');
  };

  // Update Request Status (for mechanic / driver flow)
  const updateRequestStatus = (requestId: string, status: RequestStatus) => {
    setServiceRequests(prev => 
      prev.map(r => {
        if (r.id === requestId) {
          const updated = { 
            ...r, 
            status, 
            updatedAt: new Date().toISOString(),
            finalCost: status === 'completed' ? (r.finalCost || r.estimatedCost) : r.finalCost
          };
          return updated;
        }
        return r;
      })
    );

    if (status === 'accepted') {
      soundFx.playDispatchChime();
      toast.success('Request accepted! Mechanic is preparing to dispatch.');
    } else if (status === 'en_route') {
      soundFx.playDispatchChime();
      toast.info('Mechanic is en route to breakdown location.');
    } else if (status === 'arrived') {
      soundFx.playDispatchChime();
      toast.success('Mechanic has arrived at breakdown spot!');
    } else if (status === 'completed') {
      soundFx.playSuccessTone();
      toast.success('Vehicle repair completed successfully! Invoice ready.');
    }
  };

  // Toggle Mechanic Online/Offline
  const toggleMechanicOnline = (mechanicId: string) => {
    setMechanics(prev => 
      prev.map(m => m.id === mechanicId ? { ...m, isAvailable: !m.isAvailable } : m)
    );
    const mech = mechanics.find(m => m.id === mechanicId);
    toast.info(`Mechanic status changed to ${mech?.isAvailable ? 'Offline' : 'Online & Ready for Calls'}`);
  };

  // Admin: Verify Mechanic
  const verifyMechanic = (mechanicId: string, verified: boolean) => {
    setMechanics(prev => 
      prev.map(m => m.id === mechanicId ? { ...m, isVerified: verified } : m)
    );
    toast.success(`Mechanic ${verified ? 'Verified & Approved' : 'Unverified'}`);
  };

  // Register New Mechanic
  const registerMechanic = (data: Omit<Mechanic, 'id' | 'rating' | 'reviewsCount' | 'distanceKm' | 'etaMinutes' | 'isVerified'>) => {
    const newMech: Mechanic = {
      ...data,
      id: `mech-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      reviewsCount: 1,
      distanceKm: parseFloat((Math.random() * 4 + 1.2).toFixed(1)),
      etaMinutes: Math.floor(Math.random() * 15 + 10),
      isVerified: false
    };

    setMechanics(prev => [newMech, ...prev]);
    soundFx.playSuccessTone();
    toast.success('Registration submitted! Admin review pending for verification.');
  };

  // Update Current User
  const updateUserProfile = (data: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
    toast.success('Profile updated successfully');
  };

  // Notification methods
  const addBookingNotification = (data: Omit<BookingNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: BookingNotification = {
      ...data,
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    soundFx.playDispatchChime();

    // Trigger HTML5 Web Notification
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`🚨 Motor Doctor Alert: ${data.title}`, {
          body: `Customer: ${data.customerName} (${data.customerPhone})\nLocation: ${data.locationOrGarage}`,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('md_notifications');
    toast.info('Notifications cleared');
  };

  // Auth methods
  const registerUser = (userData: { name: string; phone: string; email?: string; role: UserRole; vehicleModel?: string; vehicleNumber?: string }) => {
    const newUser: User = {
      id: `USER-${Date.now()}`,
      name: userData.name,
      phone: userData.phone,
      email: userData.email || `${userData.phone}@motordoctor.in`,
      role: userData.role,
      vehicleModel: userData.vehicleModel || 'Personal Vehicle',
      vehicleNumber: userData.vehicleNumber || 'UP 21 BK 0000'
    };
    setCurrentUser(newUser);
    setCurrentRole(userData.role);
    setIsAuthenticated(true);
    localStorage.setItem('md_auth', 'true');
    localStorage.setItem('md_user', JSON.stringify(newUser));
    localStorage.setItem('md_role', userData.role);
    soundFx.playSuccessTone();
    toast.success(`Account created! Welcome, ${userData.name}!`);
  };

  const loginUser = (emailOrPhone: string, role?: UserRole) => {
    const targetRole = role || currentRole;
    setIsAuthenticated(true);
    localStorage.setItem('md_auth', 'true');
    if (targetRole === 'admin') {
      setCurrentUser(INITIAL_USER_ADMIN);
      setCurrentRole('admin');
    } else if (targetRole === 'mechanic') {
      setCurrentUser(INITIAL_USER_MECHANIC);
      setCurrentRole('mechanic');
    } else {
      setCurrentUser(prev => ({
        ...prev,
        phone: emailOrPhone.includes('@') ? prev.phone : emailOrPhone,
        email: emailOrPhone.includes('@') ? emailOrPhone : prev.email
      }));
      setCurrentRole('driver');
    }
    soundFx.playSuccessTone();
    toast.success('Welcome back to Motor Doctor!');
    return true;
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('md_auth');
    toast.info('Signed out of Motor Doctor.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        mechanics,
        serviceRequests,
        activeRequest,
        userCoords,
        isLocating,
        createRequest,
        cancelRequest,
        updateRequestStatus,
        updatePaymentStatus,
        toggleMechanicOnline,
        verifyMechanic,
        registerMechanic,
        updateUserProfile,
        fetchLiveLocation,
        notifications,
        unreadNotificationCount,
        addBookingNotification,
        markAllNotificationsAsRead,
        clearNotifications,
        isAuthenticated,
        loginUser,
        registerUser,
        logoutUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
