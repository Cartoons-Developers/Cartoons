#ifndef ADM_CONFIG_H
#define ADM_CONFIG_H

#include "ADM_coreConfig.h"

#define ADM_BUILD_CLI 1
#define ADM_BUILD_GTK 2
#define ADM_BUILD_QT4 3

/* Jog Shuttle */
/* #undef USE_JOG */

#define PACKAGE   "avidemux"
#define ADMLOCALE "F:/jenkins/workspace/VS2019_no_import/runVs/share/locale"


#if ADM_BUILD_QT4 == ADM_BUILD_CLI || ADM_BUILD_QT4 == ADM_BUILD_GTK
/* Define if the GNU gettext() function is already present or preinstalled. */
/* #undef HAVE_GETTEXT */
#endif

// GTK+ uses X11 framework
/* #undef HAVE_GTK_X11 */

/* stricter prototyping */
/* #undef ICONV_NEED_CONST */

/* FFmpeg */
#define USE_FFMPEG

/* FreeType2 detected */
/* #undef USE_FREETYPE */

/* libvpx is available */
/* #undef USE_VPX */

/* use libsamplerate */
/* #undef USE_SRC */

#if ADM_BUILD_QT4 == ADM_BUILD_GTK ||  ADM_BUILD_QT4 == ADM_BUILD_QT4
/* SDL detected */
/* #undef USE_SDL */
#endif

#if ADM_BUILD_QT4 == ADM_BUILD_GTK || ADM_BUILD_QT4 == ADM_BUILD_QT4
/* XVideo detected */
/* #undef USE_XV */
#endif

/* Version number of package */
#define VERSION ""

// FIXME - start
#ifdef HAVE_GETTEXT
#  include <libintl.h>
#  undef _
#endif


/// FIXME - end
#if ADM_BUILD_QT4 == ADM_BUILD_QT4
/* OpenGL detected */
#define USE_OPENGL
#endif


#endif
