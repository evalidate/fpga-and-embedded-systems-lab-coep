

<%@page import="java.util.Vector"%>
<%@page import="extra.TestBench"%>
<%@page import="java.util.Random"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.Set"%>
<%@page import="extra.VcdParse"%>
<%@page import="java.io.*"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <link rel="shortcut icon" href="images/favicon.ico"/> 
        <script src="scripts/html5slider.js"></script>
        <script type="text/javascript" src="WaveDrom.js"></script> 
        <script type="text/javascript" src="WaveDromEditor.js"></script>
    </head>
    <%
        String ws = (String) session.getAttribute("workspace");
        String cycle = (String) session.getAttribute("pwm-cycle");
        String count = (String) session.getAttribute("freCount");
        String period = (String) session.getAttribute("pwm-period");
        System.out.println("cycle : " + cycle);
        System.out.println("count : " + count);

        File dir = new File("/root/Temp/" + ws + "");
        String[] children = dir.list();
        int f = 0;
        if (children != null) {
            for (int i = 0; i < children.length; i++) {
                if (children[i].contains("vcd")) {
                    f = 1;
                }
            }
        }
        if (f == 1) {


            String prev_et = (String) session.getAttribute("ET");
            if (prev_et == null) {
                prev_et = "0";
            }
            int et = Integer.parseInt(prev_et);
    %>
    <form action="RecompileTB" method="post"> 
        Select Execution Time<select name="limit">
            <%

                for (int i = 10; i < 1800;) {
                    i = i + 10;
                    if (et == i) {
                        out.print("<option value=\"" + i + "\" selected>" + i + "</option>");
                    } else {
                        out.print("<option value=\"" + i + "\">" + i + "</option>");
                    }

                }
            %>


        </select>nsec. 
        <input type="submit" value="Get Timing Diagram"/>
    </form>
    <%

    %>
    <body onload="WaveDrom.ProcessAll('skins/default.svg')">        
        <%
            Random r = new Random();
            VcdParse vp = new VcdParse();
            System.out.print("workspace: " + ws);
            vp.setTick(ws);
            vp.setVcd(ws);
            Map<Object, String> mp = null;
            vp.setSignals(ws);
            mp = vp.getMp();
            Set s = mp.entrySet();
            Iterator it = s.iterator();
            String[] signal = null;

        %>
        <script type="WaveDrom"> { "signal" : [
            <%
                while (it.hasNext()) {
                    int a = r.nextInt(6);
                    if (a == 0 | a == 1 | a == 2) {
                        a = 3;
                    }
                    Map.Entry m = (Map.Entry) it.next();
                    String key = (String) m.getKey();
                    String value = (String) m.getValue();
                    System.out.println(key + "=" + value + "<br>");
                    signal = vp.fillSignals(key);

                    for (int g = 0; g < signal.length; g++) {
                        System.out.println("signal[" + g + "]=" + signal[g]);
                    }

                    System.out.println("Carry Ahead Called for " + key);
                    /*
                     * if(value.contains("clk")|value.contains("clock")|value.contains("clck")|value.contains("clck")){
                     * if(signal[0].trim().equals("0")){ out.print("{ \"name\":
                     * \""+value+"\", \"wave\":"); out.print("\"n"); for(int
                     * i=1;i<signal.length;i++) out.print(".");
                     * out.println("\"},"); } else
                     * if(signal[0].trim().equals("1")){ out.print("{ \"name\":
                     * \""+value+"\", \"wave\":"); out.print("\"p"); for(int
                     * i=1;i<signal.length;i++) out.print(".");
                     * out.println("\"},"); } } else
                     */
                    if (vp.isOneBit(value) == 1) {
                        signal = vp.carryAhead(signal);
                        System.out.println("Value=" + value + " is one bit.");
                        out.println("{ \"name\": \"" + value + "\", \"wave\":");
                        out.print("\"");
                        for (int i = 0; i < signal.length; i++) {
                            out.print(signal[i]);
                        }
                        out.println("\"},");


                    } else if (vp.isOneBit(value) > 1) {
                        signal = vp.carryAhead(signal);
                        System.out.println("Value=" + value + " is more thwn one bit. ");
                        out.println("{ \"name\": \"" + value + "\", \"wave\":");
                        out.print("\"");
                        for (int i = 0; i < signal.length; i++) {
                            if (signal[i] == null) {
                                out.print(".");
                            } else {
                                out.print(a);
                            }
                        }
                        out.print("\",\"data\":[");
                        for (int i = 0; i < signal.length; i++) {
                            if (signal[i] != null) {
                                if (signal[i].contains("b")) {
                                    if (signal[i].contains("z")) {
                                        out.print("\"Z\"");
                                    } else if (signal[i].contains("x")) {
                                        out.print("\"X\"");
                                    } else {
                                        out.print("\"" + Long.parseLong(signal[i].replace("b", ""), 2) + "\"");
                                    }
                                } else if (signal[i].contains("h")) {
                                    if (signal[i].contains("z")) {
                                        out.print("\"Z\"");
                                    } else if (signal[i].contains("x")) {
                                        out.print("\"X\"");
                                    } else {
                                        out.print("\"" + Long.parseLong(signal[i].replace("h", ""), 16) + "\"");
                                    }
                                } else if (signal[i].contains("d")) {
                                    if (signal[i].contains("z")) {
                                        out.print("\"Z\"");
                                    } else if (signal[i].contains("x")) {
                                        out.print("\"X\"");
                                    } else {
                                        out.print("\"" + Long.parseLong(signal[i].replace("d", ""), 10) + "\"");
                                    }
                                }
                                if (i < signal.length - 1) {
                                    out.print(",");
                                }
                            }
                        }
                        out.print("] },");
                    }

                }

            %>          
            ]}

        </script> 
        <b>Note:</b>
        <%
            String zoom = request.getParameter("zoom");
            if (zoom == null) {
                zoom = "1";
            }
            out.print("<b>One tick=" + vp.getClockTime() + " nsec.</b> <br><br>");
        %>
        <form action="WaveDrom2.jsp">
            Zoom Level:<select name="zoom"> 
                <option value="1" <%if (zoom.equals("1")) {
                        out.print("selected");
                    }%>>1</option>
                <option value="2" <%if (zoom.equals("2")) {
                        out.print("selected");
                    }%> >2</option>
                <option value="3"<%if (zoom.equals("3")) {
                        out.print("selected");
                    }%> >3</option>
                <option value="4"<%if (zoom.equals("4")) {
                        out.print("selected");
                    }%> >4</option>
                <option value="5"<%if (zoom.equals("5")) {
                        out.print("selected");
                    }%> >5</option>
            </select>
            <input type="submit" value="Get Zoom" />
        </form>

        <!--        <div>
                    <br><br>
                    <input type="button" id="genGraph2" value="Plot"/>
                </div>-->
        <div>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Td : Duty Cycle (<%=cycle%> %) 
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Tp : PWM Period (<%=period%> msec)
        </div>
        <div id="chartdiv"  align="center">


            <APPLET  codebase="applet" archive="MyApplet69.jar" 
                     code="PwmGraphApplet.class" width="1200" height="300">
                <PARAM name="count" value="<%=count%>">
                <PARAM name="cycle" value="<%=cycle%>">
                This page will be very boring if your 
                browser doesn't understand Java.
            </APPLET>
        </div>

        <script type="text/javascript">WaveDrom.SetHScale(<%=zoom%>); </script>
        <% } else
                out.print("Test Bench Generation data is not ready!!!");
        %>
    </body>
</html>
