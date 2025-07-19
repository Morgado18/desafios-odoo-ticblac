
import axios from "../../utils/axios";
import axiosAuth from "../../utils/axiosAuth";
import { getToken } from "../auth/TokenService";

// Home
export const getHomeData = async () => {
  try {
    const token = await getToken();
    const response = await axios.get("/home", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    console.log('Error loading home data:', error);
    throw error;
  }
};

// record-daily-mood
export const record_daily_mood = async (moodData) => {
  try {
   // console.log('Mood data:', moodData);
   const token = await getToken();
    const response = await axios.post("/record-daily-mood", moodData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// profile
export const profile = async () => {
  try {
    const token = await getToken();
    const response = await axios.get("/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// updateProfile
export const updateProfile = async (data, imageUri = null) => {
  try {
    const token = await getToken();
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone_number);
    formData.append("nif", data.nif || "");
    formData.append("gender", data.gender || "");
    formData.append("address", data.address);
    formData.append("birth_date", data.birth_date);
    if (data.password) formData.append("password", data.password);

    if (imageUri) {
      const fileName = imageUri.split('/').pop() || `profile_${Date.now()}.jpg`;
      const fileType = imageUri.includes('image/') ? `image/jpeg` : `image/jpeg`;
      formData.append("img", {
        uri: imageUri,
        name: fileName,
        type: fileType,
      });
    }

    const response = await axios.post(`/profile/update-data`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// fertily-windows
export const fertile_window = async () => {
  try {
    const token = await getToken();
    const response = await axios.get("/fertile-window", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    //console.log('Fertile window:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// update-basal-temperature
export const update_basal_temperature = async (data) => {
  try {
    const token = await getToken();
    const response = await axios.post("/update-basal-temperature", data, {
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// update-intercourse
export const update_intercourse = async (data) => {
  try {
    const token = await getToken();
    const response = await axios.post("/update-intercourse", data, {
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// calendar
export const calendar = async () => {
  try {
    const token = await getToken();
    const response = await axios.get("/menstrual-calendar", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// posts
export const getCommunityPosts = async () => {
  try {
    const token = await getToken();
    const response = await axios.get("/posts", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// leaveCommentPost
export const leaveCommentPost = async (post_id, data) => {
  try {
    const token = await getToken();
    const response = await axios.post(`/posts/${post_id}/leave-comment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// tags
export const getTagsPosts = async () => {
  try {
    const token = await getToken();
    const response = await axios.get("/posts/tags", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// storePost
export const storePost = async (data) => {
  try {
    const token = await getToken();
    const response = await axios.post(`/posts/storePost`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// reactPost
export const reactPost = async (post_id) => {
  try {
    const token = await getToken();
    const response = await axios.get(`/posts/${post_id}/react`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ancestralWisdom
export const ancestralWisdom = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`/ancestral-wisdom`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// cycleOverview
export const cycleOverview = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`/cycle/overview`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// typeSymptoms
export const typeSymptoms = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`/type-symptoms`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// registerSymptom
export const registerSymptom = async (data) => {
  try {
    const token = await getToken();
    const response = await axios.post(`/register-symptom`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// scientificEvidence
export const scientificEvidence = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`/scientific-evidence`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// searchScientificEvidence - I didn t use this function
export const searchScientificEvidence = async (query) => {
  try {
    const token = await getToken();
    const response = await axios.get(`/scientific-evidence/search?query=${query}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// notifications
export const notifications = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`/notifications`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// markAsReadNotifications
export const markAsReadNotification = async (notification_id) => {
  try {
    const token = await getToken();
    const response = await axios.get(`/notifications/markAsRead/${notification_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// markAllAsReadNotifications
export const markAllAsReadNotifications = async () => {
  try {
    const token = await getToken();
    const response = await axios.get("/notifications/markAllAsRead", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

// removeNotifications
export const removeNotification = async (notification_id) => {
  try {
    const token = await getToken();
    const response = await axios.get(`/notifications/remove/${notification_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// removeAllNotifications
export const removeAllNotifications = async () => {
  try {
    const token = await getToken();
    const response = await axios.get('/notifications/removeAll', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// loadTeam
export const loadTeam = async () => {
  try {
    const token = await getToken();
    const response = await axios.get("/our-team", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    console.log('Error loading team:', error);
    throw error;
  }
};

// sendFeedback
export const sendFeedback = async (data) => {
  try {
    const token = await getToken();
    const response = await axios.post(`/send-feedback`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// usernames_traditional
export const usernames_traditional = async () => {
  try {
    const response = await axiosAuth.get("/usernames-traditional");
    return response.data;
  } catch (error) {
    console.log('Error loading Usernames Traditional:', error);
    throw error;
  }
};