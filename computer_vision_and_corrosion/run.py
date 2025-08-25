import cv2
from ultralytics import YOLO

# Load your trained YOLOv8 model
model = YOLO(r"C:\Users\tejte\Downloads\best.pt")  # raw string for Windows paths

# Open webcam (0 is default camera)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Cannot open camera")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    # Run detection on the frame
    results = model.predict(source=frame, imgsz=640)

    # Annotate the frame with bounding boxes
    annotated_frame = results[0].plot()

    # Show the frame
    cv2.imshow("Corrosion Detection", annotated_frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()