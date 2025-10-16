import { OrphanApplication, OrphanApplicationSummaryDTO, PageResponse, OrphanApplicationFilters } from '../types';
import { keycloakService } from './authService';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/applications/orphan`;
//const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api'}/applications/orphan`;

class ApplicationServiceError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApplicationServiceError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        if (errorText.includes('<!doctype') || errorText.includes('<html')) {
          errorMessage = response.status === 404 
            ? 'Application API endpoint not found. Please check your backend server.' 
            : 'Server returned an unexpected response.';
        } else {
          errorMessage = errorText || errorMessage;
        }
      }
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
    }
    
    throw new ApplicationServiceError(response.status, errorMessage);
  }
  
  try {
    return await response.json();
  } catch (parseError) {
    console.error('Error parsing JSON response:', parseError);
    throw new ApplicationServiceError(500, 'Invalid JSON response from server');
  }
};

export const applicationService = {
  // Single Application CRUD Operations
  async createApplication(application: OrphanApplication): Promise<OrphanApplication> {
    const authHeaders = keycloakService.getAuthHeader();
    const currentUser = keycloakService.getUser();
    
    try {
      console.log('Creating orphan application');
      console.log(`API URL: ${API_BASE_URL}`);
      
      let updatedApplication = { ...application };
      
      if (currentUser?.id && !application.verification?.agentUserId) {
        try {
          updatedApplication = {
            ...updatedApplication,
            verification: {
              ...updatedApplication.verification,
              agentUserId: currentUser.id
            }
          };
        } catch (error) {
          console.warn('Failed to capture agent user ID:', error);
        }
      }
      
      const requestBody = {
        beneficiaryUserId: application.beneficiaryUserId,
        status: updatedApplication.status,
        primaryInformation: updatedApplication.primaryInformation,
        address: updatedApplication.address,
        familyMembers: updatedApplication.familyMembers,
        basicInformation: updatedApplication.basicInformation,
        verification: updatedApplication.verification
      };
      
      console.log('Application request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(requestBody),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('createApplication error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async updateApplication(applicationId: string, application: OrphanApplication): Promise<OrphanApplication> {
    if (!applicationId) {
      throw new ApplicationServiceError(400, 'Application ID is required');
    }
    
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Updating orphan application ${applicationId}`);
      
      const response = await fetch(`${API_BASE_URL}/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(application),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('updateApplication error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async getApplication(applicationId: string): Promise<OrphanApplication> {
    if (!applicationId) {
      throw new ApplicationServiceError(400, 'Application ID is required');
    }
    
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Fetching orphan application ${applicationId}`);
      
      const response = await fetch(`${API_BASE_URL}/${applicationId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('getApplication error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async deleteApplication(applicationId: string): Promise<void> {
    const authHeaders = keycloakService.getAuthHeader();
    
    try {
      console.log(`Deleting orphan application: ${applicationId}`);
      
      const response = await fetch(`${API_BASE_URL}/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });
      
      if (!response.ok) {
        throw new ApplicationServiceError(response.status, 'Failed to delete application');
      }
    } catch (error) {
      console.error('deleteApplication error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  async updateApplicationStatus(applicationId: string, status: string, rejectionMessage?: string): Promise<OrphanApplication> {
    if (!applicationId) {
      throw new ApplicationServiceError(400, 'Application ID is required');
    }

    try {
      console.log(`Updating application ${applicationId} status to ${status}`);

      const application = await this.getApplication(applicationId);
      const updatedApplication = {
        ...application,
        status: status as any
      };

      if (rejectionMessage) {
        updatedApplication.rejectionMessage = rejectionMessage;
      }

      return await this.updateApplication(applicationId, updatedApplication);
    } catch (error) {
      console.error('updateApplicationStatus error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },

  // Application List Operations
  async getAllApplications(filters: OrphanApplicationFilters = {}): Promise<PageResponse<OrphanApplicationSummaryDTO>> {
    const authHeaders = keycloakService.getAuthHeader();

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    try {
      console.log(`Fetching orphan applications with filters:`, filters);
      console.log(`API URL: ${API_BASE_URL}?${params.toString()}`);

      const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('getAllApplications error:', error);
      if (error instanceof ApplicationServiceError) {
        throw error;
      }
      throw new ApplicationServiceError(500, 'Network error or server unavailable');
    }
  },
};