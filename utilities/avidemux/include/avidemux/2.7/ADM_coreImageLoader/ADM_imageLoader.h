/**
    \file ADM_imageLoader
*/
//
#pragma once
#include "ADM_coreImageLoader6_export.h"
#include "ADM_image.h"
/**
 */
typedef enum 
{
        ADM_PICTURE_UNKNOWN=0,
        ADM_PICTURE_JPG=1,
        ADM_PICTURE_PNG=2,
        ADM_PICTURE_BMP=3,
        ADM_PICTURE_BMP2=4
        
} ADM_PICTURE_TYPE;


/**
 * 
 * @param fd
 */
class ADM_COREIMAGELOADER6_EXPORT BmpLowLevel
{
    
public:
    BmpLowLevel(FILE *fd)
    {
        _fd=fd;
    }
    ~BmpLowLevel()
    {
        _fd=NULL;
    }
    uint32_t    read32LE ()
        {
            uint32_t i;
            i = 0;
            i += (((uint32_t)(read16LE())) << 0);
            i += (((uint32_t)read16LE()) << 16);
            return i;
        }    
        uint32_t    read32BE ()
        {
            uint32_t i;
            i = 0;
            i += (((uint32_t)(read16BE())) << 16);
            i +=(((uint32_t)read16BE()) << 0);
            return i;
        }        
    uint16_t    read16LE ()
        {
            uint16_t i;

            i = 0;
            i += (read8());
            i +=(read8() << 8);
            return i;
        }    
        uint16_t    read16BE ()
        {
            uint16_t i;

            i = 0;
            i += (read8() << 8);
            i += (read8());
            return i;
        }        
    uint8_t     read8 ()
    {
        uint8_t i;
        ADM_assert(_fd);
        i = 0;
        if (!fread(&i, 1, 1, _fd))
        {
            ADM_warning(" Problem reading the file !\n");
        }
        return i;
    }    
    void        readBmphLE(ADM_BITMAPINFOHEADER &bmp)
    {
    #define READ_FIELD(field,size)     bmp.field=read##size##LE();

        memset(&bmp,0,sizeof(bmp));

        READ_FIELD(biSize,32)
        READ_FIELD(biWidth,32)
        READ_FIELD(biHeight,32)
        READ_FIELD(biPlanes,16)            
        READ_FIELD(biBitCount,16)
        READ_FIELD(biCompression,32)            
        READ_FIELD(biSizeImage,32)
        READ_FIELD(biXPelsPerMeter,32)
        READ_FIELD(biYPelsPerMeter,32)
        READ_FIELD(biClrUsed,32)
        READ_FIELD(biClrImportant,32)
    }    
    
protected:
    FILE *_fd;
};

ADM_COREIMAGELOADER6_EXPORT ADM_PICTURE_TYPE ADM_identifyImageFile(const char *filename,uint32_t *w,uint32_t *h);

ADM_COREIMAGELOADER6_EXPORT ADMImage *createImageFromFile(const char *filename);
