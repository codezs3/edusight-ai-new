// User Type Configuration for EduSight Platform

export type UserType = 'INDIVIDUAL_PARENT' | 'SCHOOL' | 'ADMIN';

export interface UserTypeConfig {
  type: UserType;
  name: string;
  description: string;
  features: {
    paymentRequired: boolean;
    canAddUsers: boolean;
    canUploadDocuments: boolean;
    canViewAnalytics: boolean;
    canDownloadReports: boolean;
    canManageStudents: boolean;
    canAccessAdminFeatures: boolean;
    maxStudents?: number;
    maxUsers?: number;
  };
  pricing: {
    hasPaymentGateway: boolean;
    subscriptionRequired: boolean;
    freeTrialAvailable: boolean;
    pricingTiers?: {
      name: string;
      price: number;
      currency: string;
      features: string[];
    }[];
  };
}

export const USER_TYPE_CONFIGS: Record<UserType, UserTypeConfig> = {
  INDIVIDUAL_PARENT: {
    type: 'INDIVIDUAL_PARENT',
    name: 'Individual Parent',
    description: 'Direct parent access for individual child assessment',
    features: {
      paymentRequired: true,
      canAddUsers: false,
      canUploadDocuments: true,
      canViewAnalytics: true,
      canDownloadReports: true,
      canManageStudents: true,
      canAccessAdminFeatures: false,
      maxStudents: 5, // Individual parents can manage up to 5 children
    },
    pricing: {
      hasPaymentGateway: true,
      subscriptionRequired: true,
      freeTrialAvailable: true,
      pricingTiers: [
        {
          name: 'Basic',
          price: 599,
          currency: 'INR',
          features: ['1 Child Assessment', 'Basic Reports', 'Email Support']
        },
        {
          name: 'Premium',
          price: 899,
          currency: 'INR',
          features: ['Up to 3 Children', 'Advanced Analytics', 'Priority Support', 'PDF Reports']
        },
        {
          name: 'Family',
          price: 1499,
          currency: 'INR',
          features: ['Up to 5 Children', 'All Features', 'Phone Support', 'Career Guidance']
        }
      ]
    }
  },
  SCHOOL: {
    type: 'SCHOOL',
    name: 'School/Institution',
    description: 'Educational institution with multiple users and students',
    features: {
      paymentRequired: true,
      canAddUsers: true,
      canUploadDocuments: true,
      canViewAnalytics: true,
      canDownloadReports: true,
      canManageStudents: true,
      canAccessAdminFeatures: false,
      maxStudents: 1000, // Schools can manage many students
      maxUsers: 100, // Schools can have multiple teachers/parents
    },
    pricing: {
      hasPaymentGateway: true,
      subscriptionRequired: true,
      freeTrialAvailable: true,
      pricingTiers: [
        {
          name: 'Small School',
          price: 5000,
          currency: 'INR',
          features: ['Up to 100 Students', '5 Teachers', 'Basic Analytics', 'Email Support']
        },
        {
          name: 'Medium School',
          price: 15000,
          currency: 'INR',
          features: ['Up to 500 Students', '20 Teachers', 'Advanced Analytics', 'Priority Support']
        },
        {
          name: 'Large School',
          price: 35000,
          currency: 'INR',
          features: ['Up to 1000 Students', '50 Teachers', 'All Features', 'Dedicated Support']
        }
      ]
    }
  },
  ADMIN: {
    type: 'ADMIN',
    name: 'System Administrator',
    description: 'Platform administrators with full access',
    features: {
      paymentRequired: false, // Admins bypass all payments
      canAddUsers: true,
      canUploadDocuments: true,
      canViewAnalytics: true,
      canDownloadReports: true,
      canManageStudents: true,
      canAccessAdminFeatures: true,
      maxStudents: undefined, // Unlimited
      maxUsers: undefined, // Unlimited
    },
    pricing: {
      hasPaymentGateway: false, // No payment gateway for admins
      subscriptionRequired: false,
      freeTrialAvailable: false,
    }
  }
};

// Helper functions
export function getUserTypeConfig(userRole: string): UserTypeConfig {
  switch (userRole) {
    case 'ADMIN':
      return USER_TYPE_CONFIGS.ADMIN;
    case 'SCHOOL_ADMIN':
    case 'TEACHER':
      return USER_TYPE_CONFIGS.SCHOOL;
    case 'PARENT':
      return USER_TYPE_CONFIGS.INDIVIDUAL_PARENT;
    default:
      return USER_TYPE_CONFIGS.INDIVIDUAL_PARENT;
  }
}

export function requiresPayment(userRole: string): boolean {
  const config = getUserTypeConfig(userRole);
  return config.features.paymentRequired;
}

export function canBypassPayment(userRole: string): boolean {
  return userRole === 'ADMIN';
}

export function hasPaymentGateway(userRole: string): boolean {
  const config = getUserTypeConfig(userRole);
  return config.pricing.hasPaymentGateway;
}

export function canAddUsers(userRole: string): boolean {
  const config = getUserTypeConfig(userRole);
  return config.features.canAddUsers;
}

export function canAccessAdminFeatures(userRole: string): boolean {
  const config = getUserTypeConfig(userRole);
  return config.features.canAccessAdminFeatures;
}

export function getMaxStudents(userRole: string): number | undefined {
  const config = getUserTypeConfig(userRole);
  return config.features.maxStudents;
}

export function getMaxUsers(userRole: string): number | undefined {
  const config = getUserTypeConfig(userRole);
  return config.features.maxUsers;
}

// Payment status types
export type PaymentStatus = 'PAID' | 'UNPAID' | 'TRIAL' | 'EXPIRED' | 'ADMIN_BYPASS';

export function getPaymentStatus(userRole: string, isPaid: boolean = false, isTrial: boolean = false): PaymentStatus {
  if (canBypassPayment(userRole)) {
    return 'ADMIN_BYPASS';
  }
  
  if (isTrial) {
    return 'TRIAL';
  }
  
  if (isPaid) {
    return 'PAID';
  }
  
  return 'UNPAID';
}
