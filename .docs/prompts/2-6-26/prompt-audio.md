
https://www.figma.com/design/iMBw7JR7Gfon90hMoTBfcL/Advanced-Care-Directive-Web?node-id=85-1970&m=dev

Using #f, create a desktop AudioPlayer component based on the design in this Figma link

The component is used as an intro player in a care directive app — it plays a general introduction before the user begins the Q&A flow.

Design:

Full-width player with a decorative background image
Reference the layout, colors, typography, and spacing from the Figma file
Desktop dimensions only for now (mobile will follow in a later iteration)

Functionality:

Play/pause toggle
Progress bar
Time display (current time / total duration)
Auto-stops at end of track

Props:

audioSrc (string)
backgroundImage (string)