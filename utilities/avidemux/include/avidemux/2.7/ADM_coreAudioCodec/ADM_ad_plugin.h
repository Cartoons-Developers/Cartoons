/**
        \fn ADM_ad_plugin.h
        \brief Interface for dynamically loaded audio decoder
*/
#ifndef ADM_ad_plugin_h
#define ADM_ad_plugin_h
#include "ADM_default.h"
#include "ADM_coreAudio.h"
#include "ADM_audiocodec.h"


#define AD_API_VERSION 4
/* These are the 6 functions exported by each plugin ...*/
typedef ADM_Audiocodec  *(ADM_ad_CreateFunction)(uint32_t fourcc, 
								WAVHeader *info,uint32_t extraLength,uint8_t *extraData);
typedef void             (ADM_ad_DeleteFunction)(ADM_Audiocodec *codec);
typedef int             (ADM_ad_SupportedFormat)(uint32_t audioFourcc);
typedef uint32_t         (ADM_ad_GetApiVersion)(void);
typedef bool            (ADM_ad_GetDecoderVersion)(uint32_t *major, uint32_t *minor, uint32_t *patch);
typedef const char       *(ADM_ADM_ad_GetInfo)(void);

/* handly macro to declare plugins*/
/**
    \struct ad_supportedFormat
*/
typedef struct
{
    uint32_t fourcc;
    uint32_t priority;  // The lower the value, the less desirable the codec is, 0 means unsupported
                        // Valid value ranges from 1 (low quality codec) to 254 (must have codec)
}ad_supportedFormat;

#define AD_LOW_QUAL     50
#define AD_MEDIUM_QUAL  100
#define AD_HIGH_QUAL    150

#define DECLARE_AUDIO_DECODER(Class,Major,Minor,Patch,Formats,Desc) \
	extern "C" { \
	ADM_PLUGIN_EXPORT ADM_Audiocodec *create(uint32_t fourcc,	WAVHeader *info,uint32_t extraLength,uint8_t *extraData)\
	{ \
		return new Class(fourcc,	info,extraLength,extraData);\
	} \
	ADM_PLUGIN_EXPORT ADM_Audiocodec *destroy(ADM_Audiocodec *codec) \
	{ \
		Class *a=(Class *)codec;\
		delete a;\
        return NULL;\
	}\
	ADM_PLUGIN_EXPORT int supportedFormat(uint32_t audioFourcc) \
	{ \
		for(int i=0;i<sizeof(Formats)/sizeof(ad_supportedFormat);i++)\
			if(Formats[i].fourcc==audioFourcc) \
				return Formats[i].priority; \
		return 0; \
	} \
	ADM_PLUGIN_EXPORT uint32_t getApiVersion(void)\
	{\
			return AD_API_VERSION;\
	}\
	ADM_PLUGIN_EXPORT bool getDecoderVersion(uint32_t *major,uint32_t *minor, uint32_t *patch)\
	{\
		*major=Major;\
		*minor=Minor;\
		*patch=Patch;\
		return true;\
	}\
	ADM_PLUGIN_EXPORT const char *getInfo(void)\
	{\
		return Desc; \
	}\
	}

#endif
