export const getOptimizedImageUrl = (url, width = 600) => {
  if (!url) return "";
  
  if (url.includes("res.cloudinary.com")) {
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  
  return url;
};
