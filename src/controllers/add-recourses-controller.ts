import { Router } from "express";
import { browser } from "../services/browser-service";
import { login } from "../services/login-service";
import { blog } from "../services/change-blog-service";
import { posts } from "../services/posts-service";
import { SearchType, edit } from "../services/edit-service";
import { addRecourses } from "../services/add-recourses";
import { changeEditor } from "../services/change-editor-service";
import { close } from "../services/close-service";

export const addRecoursesController = Router();

addRecoursesController.post(
  "/add",
  browser,
  login,
  blog(765746),
  changeEditor("6", "dashboard"),
  posts,
  edit(SearchType.NUMBER),
  addRecourses,
  changeEditor("7", "edit"),
  close
);
