#!/usr/bin/env python3
"""Re-encode the film's clips for the web: same trims, speeds and framing as atomic-policy-film/film.html.
Run:  python3 -I tools/encode.py [name-filter]     (skips files that already exist)"""
import subprocess, sys, os, shlex
from concurrent.futures import ThreadPoolExecutor
A='/Users/zhangkaidi/Downloads/atomic-policy-film/assets/'
SUB='/Users/zhangkaidi/Downloads/CVPR submission/'
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','media')
ZOOM={'5185':(1.15,.5,.55),'5183':(1.15,.5,.55),'5186':(1.15,.5,.55),'5147':(1.3,.42,.57),'5181':(1.15,.5,.55),'5194':(1.3,.39,.55),'5175':(1.3,.42,.57),'5149':(1.3,.42,.5),'5158':(1.3,.39,.6),
 '5202':(1.5,.45,.5),'5203':(1.5,.45,.5),'5199':(1.5,.45,.52),'5112':(1.4,.57,.64),'5197':(1.5,.45,.62),'5200':(1.5,.5,.55),'5117':(1.5,.52,.6),'5119':(1.5,.58,.62),'5107':(1.5,.42,.6),
 '5133':(1.4,.36,.64),'5097':(1.4,.42,.62),'5134':(1.4,.36,.62),'5089':(1.4,.43,.64),'5224':(1.4,.45,.62),'5137':(1.4,.4,.6),'5222':(1.4,.47,.62),'5205':(1.4,.5,.64)}
def zc(s,cx,cy):
    h=1/(2*s); cx=min(max(cx,h),1-h); cy=min(max(cy,h),1-h)
    return 'crop=iw/%g:ih/%g:iw*%.4f:ih*%.4f'%(s,s,cx-h,cy-h)
J=[]  # (name, src, in, out, speed, filters-after-speed, fps, crf)
def add(name,src,i,o,sp,vf,fps=30,crf=26): J.append((name,src,i,o,sp,vf,fps,crf))
REAL=[('5185','real/MVI_5185_multi_drawer_multi-grasp.MP4',0,128.8,17),('5183','multidrawer_atomic.MP4',0,49.5,7),('5186','real/MVI_5186_multi-drawer_pi05_left.MP4',0,53,7),('5147','real/MVI_5147_multi-drawer_molmobot_ft.MP4',0,221.5,30),('5181','real/MVI_5181_multi-drawer_pi05_success.MP4',0,71,9),
 ('5194','real/MVI_5194_multi-drawer_ood_fast.MP4',0,74,10),('5175','real/MVI_5175_multi-drawer_ood_lemon.MP4',0,178,24),('5149','real/MVI_5149_multi-drawer_ood_fail.MP4',0,290,32),('5158','real/MVI_5158_multi-drawer_ood_success.MP4',0,101.5,13),
 ('5202','real/MVI_5202_stacking_atomic_dp_fail.MP4',0,136.9,16),('5203','real/MVI_5203_stacking_success_1.MP4',0,63,9),('5199','real/MVI_5199_stacking_success_2.MP4',0,50.8,7),('5112','real/MVI_5112_stacking_fail.mp4',0,216.6,25),('5197','real/MVI_5197_stacking_pi05_ft.MP4',0,69.5,10),
 ('5200','real/MVI_5200_stacking_ood_success.MP4',0,49.2,7),('5117','stacking_replan.MP4',258,510,35),('5119','real/MVI_5119_stacking_ood_fail.MP4',0,168.1,19),('5107','real/MVI_5107_stacking_ood_pi05_ft_success.MP4',0,150.8,20),
 ('5133','real/MVI_5133_crossword_atomic_success_aligned.MP4',0,325.5,42),('5097','real/MVI_5097_crossword_atomic_success.MP4',0,315.2,42),('5134','real/MVI_5134_crossword_success.MP4',0,318.3,42),('5089','real/MVI_5089_crossword_fail.mp4',0,167.9,19),('5232','crossword_e2e_fail.mp4',0,800,87),
 ('5224','real/MVI_5224_crossword_DP_ood2.mp4',0,418.8,53),('5137','real/MVI_5137_crossword_ood1.MP4',0,759.4,98),('5222','real/MVI_5222_crossword_ood_fail.MP4',0,408.3,44),('5205','real/MVI_5205_crossword_ood_fail_pi05_ft.MP4',0,158.5,17)]
for n,f,i,o,sp in REAL:
    add('real_'+n,A+f,i,o,sp,(zc(*ZOOM[n])+',' if n in ZOOM else '')+'scale=960:540')
for k in ['atomic_clip','atomic_dino','atomic_resnet','atomic_pi05']:
    add('push_'+k,A+'push5/push100003_%s.mp4'%k,0,None,18,'scale=784:448')
    add('table_'+k,A+'tabletop/tabletop100001_%s.mp4'%k,0,None,2,'crop=448:336:0:44',20)
for k in ['vla','vla_clip','pi05_lora','pi05_full']:
    add('push_'+k,A+'push5/push100003_%s.mp4'%k,0,162.79,18,'scale=784:448')
    add('table_'+k,A+'tabletop/tabletop100001_%s.mp4'%k,0,14.5,2,'crop=448:336:0:44',20)
for k in ['100004','100005','100008']: add('push_'+k,A+'push5/push%s.mp4'%k,0,None,18,'scale=784:448')
for k in ['100000','100002','100003']: add('table_'+k,A+'tabletop/tabletop%s.mp4'%k,0,None,2,'crop=448:336:0:44',20)
for k,o in [('a1_episode_0009_success',None),('a2_episode_0009_fail',33.12),('a3_episode_0009_success',None),('a4_episode_0009_fail',33.12),('a5_pi05_zeroshot_episode_0009_fail',33.12),('a6_pi05_ft_episode_0009_fail',33.12)]:
    add('molmo_'+k[:2],A+'molmo/%s.mp4'%k,0,o,6,'scale=800:460')
for k in ['0015','0030','0068','0069','0170','0185']: add('molmo_s'+k,A+'molmo/a1_episode_%s_success.mp4'%k,0,None,8,'scale=800:460')
C='scale=640:360:force_original_aspect_ratio=increase,crop=640:360'
add('thumb_push5',A+'push5_atomic.mp4',10,17.02,1.4,C); add('thumb_tabletop',A+'tabletop_chain.mp4',0,7.02,1.4,C)
add('thumb_molmo',A+'molmospaces_atomic.mp4',5,12.02,1.4,'crop=640:368:0:0,'+C)
add('thumb_drawer',A+'multidrawer_atomic.MP4',4,32.08,5.6,zc(1.3,.5,.5)+','+C); add('thumb_stacking',A+'stacking_replan.MP4',378,420.12,8.4,zc(1.3,.5,.5)+','+C); add('thumb_crossword',A+'crossword_atomic.MP4',200,228.08,5.6,zc(1.3,.5,.5)+','+C)
add('m_chain',A+'tabletop_chain.mp4',0,None,1,'scale=448:448',10,22)
add('m_point',A+'tabletop_chain.mp4',3,4.1,.5,'scale=448:448',10,22); add('m_pick',A+'tabletop_chain.mp4',3.8,5,.5,'scale=448:448',10,22)
add('m_replan',A+'stacking_replan.MP4',275.5,285.75,1,'scale=960:540')
add('m_arch',SUB+'Atomic Policy - supplementary material/Atomic Policy - video.mp4',82.05,114.2,1,'scale=1920:1080',30,23)
add('hero',SUB+'video/stacking/MVI_5261_stacking_zoomin_human.mp4',0,None,60,"scale=1600:900,curves=all='0/0 0.25/0.37 0.5/0.68 0.75/0.88 1/1',colorbalance=rm=-.035:bm=.04:rh=-.03:bh=.035,eq=saturation=1.12",30,23)  # graded: midtones lifted, warm cast eased
def run(j):
    name,src,i,o,sp,vf,fps,crf=j; out=os.path.join(OUT,name+'.mp4'); jpg=os.path.join(OUT,name+'.jpg')
    if not os.path.exists(out):
        cmd=['ffmpeg','-v','error','-y','-ss',str(i)]+(['-to',str(o)] if o else [])+['-i',src,'-an','-map_metadata','-1','-map_chapters','-1',
             '-vf','setpts=(PTS-STARTPTS)/%g,fps=%d,%s,format=yuv420p'%(sp,fps,vf),'-c:v','libx264','-preset','slow','-crf',str(crf),'-movflags','+faststart',out+'.tmp.mp4']
        r=subprocess.run(cmd,capture_output=True,text=True)
        if r.returncode: return name+' FAILED '+r.stderr[-300:]
        os.replace(out+'.tmp.mp4',out)
    if not os.path.exists(jpg):
        subprocess.run(['ffmpeg','-v','error','-y','-i',out,'-frames:v','1','-q:v','4','-map_metadata','-1',jpg])
    d=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',out],capture_output=True,text=True).stdout.strip()
    return '%s %s s %d KB'%(name,d,os.path.getsize(out)//1024)
flt=sys.argv[1] if len(sys.argv)>1 else ''
with ThreadPoolExecutor(4) as ex:
    for r in ex.map(run,[j for j in J if flt in j[0]]): print(r,flush=True)
