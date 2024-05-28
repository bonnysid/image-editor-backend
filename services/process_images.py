import cv2
import sys
import numpy as np

def detect_keypoints(img_path, output_path, method):
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    if method == 'harris':
        gray = np.float32(gray)
        dst = cv2.cornerHarris(gray, 2, 3, 0.04)
        # Уменьшение порога для увеличения количества ключевых точек
        img[dst > 0.001 * dst.max()] = [0, 0, 255]

        # Увеличение радиуса ключевых точек
        dst_dilated = cv2.dilate(dst, None)
        img[dst_dilated > 0.001 * dst_dilated.max()] = [0, 255, 0]
    elif method == 'sift':
        sift = cv2.xfeatures2d.SIFT_create()
        keypoints = sift.detect(gray, None)
        img = cv2.drawKeypoints(img, keypoints, None)
    elif method == 'surf':
        surf = cv2.xfeatures2d.SURF_create(3000)
        keypoints = surf.detect(gray, None)
        img = cv2.drawKeypoints(img, keypoints, None)
    elif method == 'fast':
        fast = cv2.FastFeatureDetector_create()
        keypoints = fast.detect(gray, None)
        img = cv2.drawKeypoints(img, keypoints, None)
    else:
        raise ValueError('Invalid method')

    cv2.imwrite(output_path, img)

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print("Usage: python process_image.py <img_path> <output_path> <method>")
    else:
        detect_keypoints(sys.argv[1], sys.argv[2], sys.argv[3])