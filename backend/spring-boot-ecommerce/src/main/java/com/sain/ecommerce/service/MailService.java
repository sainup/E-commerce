package com.sain.ecommerce.service;

import com.sain.ecommerce.exceptions.EcommerceException;
import com.sain.ecommerce.model.NotificationEmail;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;
    private final MailContentBuilder mailContentBuilder;

    @Async
    public void sendMail(NotificationEmail notificationEmail){
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("fullstack_ecommerce@gmail.com");
            messageHelper.setTo(notificationEmail.getRecipient());
            messageHelper.setSubject(notificationEmail.getSubject());
            messageHelper.setText(notificationEmail.getBody());

        };

        try{
            mailSender.send(messagePreparator);
            log.info("Activation email sent!!");
        }catch (MailException e){
            log.error("Exception occurred while sending mail",e);
            throw new EcommerceException("Exception occurred while sending mail to " + notificationEmail.getRecipient(), e);
        }
    }
}
