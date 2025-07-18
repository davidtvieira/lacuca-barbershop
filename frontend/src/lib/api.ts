import useSWR from 'swr';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { isPast } from 'date-fns';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, timeout: 5000 });
api.interceptors.request.use(
  async function (config) {
    // @ts-ignore
    config.headers.Authorization = await getAccessToken();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
let cachedToken: { token: string | null; expiresAt: Date } = { token: null, expiresAt: new Date() };

async function getAccessToken() {
  if (!cachedToken.token || isPast(cachedToken.expiresAt)) {
    const session = await getSession();

    if (session) {
      cachedToken.token = session.accessToken;
      cachedToken.expiresAt = session.accessTokenExpires;
    }
  }

  return cachedToken.token;
}

async function fetcher(url: string) {
  if (!url || url.includes('undefined') || url.includes('null')) return null;

  const response = await api.get(url);

  return response.data;
}

export function useScheduledAppointments(barberUID: string | undefined, date: string) {
  const { data, error, mutate, isValidating } = useSWR(`/barbers/appointments/${barberUID}/${date}`, fetcher);

  const appointments = data?.message;
  if (appointments) {
    appointments.sort(function (a: any, b: any) {
      // @ts-ignore
      return new Date(a.date) - new Date(b.date);
    });
  }

  return {
    appointments,
    mutateAppointments: mutate,
    isValidating,
    isError: error,
  };
}

export function useClientScheduledAppointments(date: string) {
  const { data, error, mutate } = useSWR(`/users/appointments/${date}`, fetcher);

  const appointments = data?.message;
  if (appointments) {
    appointments.sort(function (a: any, b: any) {
      // @ts-ignore
      return new Date(b.date) - new Date(a.date);
    });
  }

  return {
    appointments,
    mutateAppointments: mutate,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useClientScheduledAppointmentsActive() {
  const { data, error, mutate } = useSWR(`/users/appointments`, fetcher);

  const activeAppointments = data?.message;
  if (activeAppointments) {
    activeAppointments.sort(function (a: any, b: any) {
      // @ts-ignore
      return new Date(b.date) - new Date(a.date);
    });
  }

  return {
    activeAppointments,
    mutateActiveAppointments: mutate,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useBarberUnavailability(barberUID: string | undefined) {
  const { data, error, mutate, isValidating } = useSWR(`/barbers/schedule/unavailable/${barberUID}`, fetcher);

  const unavailabilities = data?.message;
  if (unavailabilities) {
    unavailabilities.sort(function (a: any, b: any) {
      // @ts-ignore
      return new Date(b.from) - new Date(a.from);
    });
  }

  return {
    unavailabilities,
    mutateUnavailabilities: mutate,
    isValidating,
    isError: error,
  };
}

export async function forceDeleteAppointment(uid: string, date: string) {
  await api.delete('/barbers/schedule/appointment/force', {
    data: {
      uid,
      date,
    },
  });
}

export async function deleteAppointment(uid: string, date: string) {
  await api.delete('/barbers/schedule/appointment', {
    data: {
      uid,
      date,
    },
  });
}

export function useActiveBarbers() {
  const { data, error } = useSWR(`/barbers`, fetcher);

  return {
    barbers: data?.message,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useUserProfile(uid: string) {
  const { data, error } = useSWR(`/users/profile/${uid}`, fetcher);

  return {
    userProfile: data?.message,
    isLoading: !error && !data,
    isError: error,
  };
}

export async function scheduleAppointment(uid: string, date: string, description: string | undefined = undefined) {
  await api.put('/barbers/schedule/appointment', {
    uid,
    date,
    description,
  });
}

export async function addUnavailabilityPeriod(from: string, to: string) {
  await api.post('/barbers/schedule/unavailable', {
    from,
    to,
  });
}

export async function deleteUnavailabilityPeriod(from: string, to: string) {
  await api.delete('/barbers/schedule/unavailable', {
    data: {
      from,
      to,
    },
  });
}

export async function updateWeeklySchedule(weeklySchedule: any) {
  // 2 + 2 = 4 quick maths
  // ignore this fast fix, thanks
  weeklySchedule.forEach((weekday: any) => {
    if (typeof weekday.breaks == 'string') {
      weekday.breaks = weekday.breaks.replace('[', '').replace(']', '').split(',');
    }
  });

  await api.put('/barbers/schedule/weekly', weeklySchedule);
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber: number
) {
  await api.post('/auth/signup', {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
  });
}

export async function verifyEmail(token: string) {
  await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      requestType: 'VERIFY_EMAIL',
      idToken: token,
    }
  );
}

export async function checkEmailVerificationCode(oobCode: string) {
  await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      oobCode,
    }
  );
}

export async function sendPasswordResetEmail(email: string) {
  await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      requestType: 'PASSWORD_RESET',
      email,
    }
  );
}

export async function resetPassword(code: string, password: string) {
  await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      oobCode: code,
      newPassword: password,
    }
  );
}
