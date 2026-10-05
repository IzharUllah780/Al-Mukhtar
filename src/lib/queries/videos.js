import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const videoKeys = {
  all: ["videos"],
  adminAll: ["adminVideos"],
  detail: (id) => ["videos", id],
};

export function useVideos() {
  return useQuery({
    queryKey: videoKeys.all,
    queryFn: async () => {
      const res = await api.get("/api/videos");
      return res.data?.videos || [];
    },
    staleTime: 30 * 1000,
  });
}

export function useAdminVideos() {
  return useQuery({
    queryKey: videoKeys.adminAll,
    queryFn: async () => {
      const res = await api.get("/api/videos");
      return res.data?.videos || [];
    },
    staleTime: 10 * 1000,
  });
}

export function useVideoMutations() {
  const queryClient = useQueryClient();

  const createVideo = useMutation({
    mutationFn: (data) => api.post("/api/videos", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
      queryClient.invalidateQueries({ queryKey: videoKeys.adminAll });
    },
  });

  const updateVideo = useMutation({
    mutationFn: ({ id, data }) => api.put(`/api/videos/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
      queryClient.invalidateQueries({ queryKey: videoKeys.adminAll });
    },
  });

  const deleteVideo = useMutation({
    mutationFn: (id) => api.delete(`/api/videos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
      queryClient.invalidateQueries({ queryKey: videoKeys.adminAll });
    },
  });

  return { createVideo, updateVideo, deleteVideo };
}
