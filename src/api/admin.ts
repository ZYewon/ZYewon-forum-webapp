import request from "@/service";

export const deletePost = (id: string) => {
  return request.delete({
    url: "/admin/content-delete",
    params: {
      id,
    },
  });
};

export const postPrime = (data: any) => {
  return request.post({
    url: "/admin/content-update",
    data,
  });
};
