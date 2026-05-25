<script lang="ts">
  import { API_BASE_URL } from '$lib/config';
  import { reveal, trackSection } from '$lib/actions/intersection';
  import { contactChannels } from '$lib/data/content';
  import type { ContactPayload, SectionChangeHandler } from '$lib/types';
  import Icon from '$lib/components/Icon.svelte';

  let {
    onSectionChange,
    showToast
  }: {
    onSectionChange: SectionChangeHandler;
    showToast: (message: string) => void;
  } = $props();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let form = $state({
    name: '',
    email: '',
    message: ''
  });

  let touched = $state({
    name: false,
    email: false,
    message: false
  });

  let submitting = $state(false);
  let messageInput: HTMLTextAreaElement | undefined;

  let errors = $derived({
    name: form.name.trim() ? '' : 'Please enter your name.',
    email:
      form.email.trim() && emailPattern.test(form.email.trim())
        ? ''
        : 'Please enter a valid email.',
    message: form.message.trim() ? '' : 'Please enter a message.'
  });

  function touchAll() {
    touched.name = true;
    touched.email = true;
    touched.message = true;
  }

  function resetForm() {
    form.name = '';
    form.email = '';
    form.message = '';
    touched.name = false;
    touched.email = false;
    touched.message = false;
  }

  function focusMessageBox() {
    touched.message = true;
    messageInput?.focus();
  }

  async function submitForm(event: SubmitEvent) {
    event.preventDefault();
    touchAll();

    if (errors.name || errors.email || errors.message) {
      return;
    }

    submitting = true;

    const payload: ContactPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message_body: form.message.trim()
    };

    try {
      const response = await fetch(`${API_BASE_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Message request failed: ${response.status}`);
      }

      await response.json();
      resetForm();
      showToast('Your message has been sent.');
    } catch {
      showToast('Could not send your message right now.');
    } finally {
      submitting = false;
    }
  }
</script>

<section
  id="contact"
  class="contact"
  use:trackSection={{ id: 'contact', onChange: onSectionChange }}
>
  <div class="container">
    <div class="section-header reveal" use:reveal>
      <h2>Get In Touch</h2>
      <p>Have a question or want to work together? Drop me a message.</p>
    </div>

    <div class="contact-wrapper reveal" use:reveal>
      <div class="contact-info">
        <h3>Let's Connect</h3>
        <p>
          I'm always open to new opportunities, collaborations, and interesting conversations
          about technology. Feel free to reach out through the form or any channel below.
        </p>

        <div class="contact-details">
          {#each contactChannels as channel}
            {#if channel.action === 'message'}
              <button
                type="button"
                class="contact-item"
                aria-label={`Focus message form for ${channel.label}`}
                onclick={focusMessageBox}
              >
                <div class="icon-circle">
                  <Icon name={channel.icon} size={20} />
                </div>
                <span>{channel.label}</span>
              </button>
            {:else if channel.href}
              <a
                href={channel.href}
                class="contact-item"
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noopener noreferrer' : undefined}
              >
                <div class="icon-circle">
                  <Icon name={channel.icon} size={20} />
                </div>
                <span>{channel.label}</span>
              </a>
            {:else}
              <div class="contact-item">
                <div class="icon-circle">
                  <Icon name={channel.icon} size={20} />
                </div>
                <span>{channel.label}</span>
              </div>
            {/if}
          {/each}
        </div>
      </div>

      <form id="contact-form" class="contact-form" novalidate onsubmit={submitForm}>
        <div class:error={touched.name && !!errors.name} class="form-group">
          <input
            type="text"
            id="form-name"
            placeholder=" "
            bind:value={form.name}
            onblur={() => (touched.name = true)}
            required
          />
          <label for="form-name">Your Name</label>
          <span class="form-error">{errors.name}</span>
        </div>

        <div class:error={touched.email && !!errors.email} class="form-group">
          <input
            type="email"
            id="form-email"
            placeholder=" "
            bind:value={form.email}
            onblur={() => (touched.email = true)}
            required
          />
          <label for="form-email">Your Email</label>
          <span class="form-error">{errors.email}</span>
        </div>

        <div class:error={touched.message && !!errors.message} class="form-group">
          <textarea
            id="form-message"
            bind:this={messageInput}
            placeholder=" "
            bind:value={form.message}
            onblur={() => (touched.message = true)}
            required
          ></textarea>
          <label for="form-message">Your Message</label>
          <span class="form-error">{errors.message}</span>
        </div>

        <button type="submit" class="btn btn-primary" disabled={submitting} aria-busy={submitting}>
          Send Message
          <Icon name="send" size={18} />
        </button>
      </form>
    </div>
  </div>
</section>
