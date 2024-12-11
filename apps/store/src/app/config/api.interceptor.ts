import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = `http://localhost:3050/store/${req.url}`;
  return next(req.clone({ url }));
};
