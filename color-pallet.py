import matplotlib.pyplot as plt
from matplotlib.pyplot import colormaps
import numpy as np
import cv2
from matplotlib import cm
from matplotlib.colors import ListedColormap, LinearSegmentedColormap

image = cv2.imread('frame.png', 0)
#colormap = plt.get_cmap('inferno')
#top = cm.get_cmap('Oranges_r', 85)
middle = cm.get_cmap('Greens_r',128)
#bottom = cm.get_cmap('Blues', 126)
bottom = np.ones((128,4))
bottom[:,0] = np.linspace(255/256, 1, 128)
bottom[:,1] = np.linspace(20/256, 1, 128)
bottom[:,2] = np.linspace(147/256, 1, 128)
'''newcolors = np.vstack((#top(np.linspace(0, 1, 85)),
                       middle(np.linspace(0,1,128)),
                       bottom))'''

colorsList = []
numberOfColorsInPallet = int(input("Enter the number of colors"))
distribution = int(256/numberOfColorsInPallet)
rgbColors=[]
for i in range(0,numberOfColorsInPallet):
    colorcode = input("Enter the hexvalue of color").lstrip('#')
    HEXtoRGB = tuple(int(colorcode[j:j+2], 16) for j in (0, 2, 4))
    rgbColors.append(list(HEXtoRGB))
for i in range(0,numberOfColorsInPallet):
    colorsList.append(np.ones((distribution,4)))
    colorsList[i][:,0] = np.linspace(rgbColors[i][0]/256, 1, distribution)
    colorsList[i][:,1] = np.linspace(rgbColors[i][1]/256, 1, distribution)
    colorsList[i][:,2] = np.linspace(rgbColors[i][2]/256, 1, distribution)
newcolors = np.vstack(tuple(colorsList))
newcmp = ListedColormap(newcolors, name='OrangeBlue')
colormap = newcmp
heatmap = (colormap(image) * 2**16).astype(np.uint16)[:,:,:3]
heatmap = cv2.cvtColor(heatmap, cv2.COLOR_RGB2BGR)

cv2.imshow('image', image)
cv2.imshow('heatmap', heatmap)
cv2.waitKey()