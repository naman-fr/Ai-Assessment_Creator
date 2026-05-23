import { Router } from "express";
import { assignmentController } from "../controllers/assignmentController";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/", assignmentController.getAll);
router.get("/:id", assignmentController.getById);
router.post("/", upload.single("file"), assignmentController.create);
router.delete("/:id", assignmentController.remove);
router.post("/:id/regenerate", assignmentController.regenerate);
router.get("/:id/pdf", assignmentController.getPdf);

export default router;
