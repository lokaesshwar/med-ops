import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'doctor@medops.com',
    name: 'Dr. Sarah Johnson',
    role: UserRole.DOCTOR,
    department: 'Cardiology',
    avatar: 'https://images.pexels.com/photos/559455/pexels-photo-559455.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '2',
    email: 'nurse@medops.com',
    name: 'Emily Chen',
    role: UserRole.NURSE,
    department: 'Emergency',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '3',
    email: 'admin@medops.com',
    name: 'Michael Rodriguez',
    role: UserRole.ADMIN,
    department: 'Administration',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '4',
    email: 'patient@medops.com',
    name: 'Jennifer Wilson',
    role: UserRole.PATIENT,
    department: null,
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

// Async thunk for login
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === credentials.email);
    if (foundUser) {
      localStorage.setItem('medops_user', JSON.stringify(foundUser));
      return foundUser;
    }
    
    return rejectWithValue('Invalid email or password');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('medops_user');
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    loadUserFromStorage: (state) => {
      const storedUser = localStorage.getItem('medops_user');
      if (storedUser) {
        try {
          state.user = JSON.parse(storedUser);
        } catch (e) {
          state.user = null;
        }
      }
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, setUser, setLoading, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;

