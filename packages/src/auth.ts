export type JoinRequest = {
  token: string;
};

export type JoinResponse = {
  message: string;
  role: string;
};

export type MeResponse = {
  id: string;
  name: string;
  is_app_admin: boolean;
  circle_members: {
    role: string;
    circles: {
      id: string;
      name: string;
    };
  }[];
};

export type InviteRequest = {
  circle_id: string;
  role: 'circle_admin' | 'general';
};

export type InviteResponse = {
  invite_url: string;
  token: string;
  role: string;
};

export type UpdateProfileRequest = {
  name: string;
};

export type UpdateProfileResponse = {
  message: string;
};
